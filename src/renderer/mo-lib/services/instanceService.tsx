import { ReactElement } from 'react';
import { container } from 'tsyringe';
import molecule from 'mo';
import { ILocale, IExtension } from '@hubai/core';
import type { Controller } from '@hubai/core/esm/react';
import { GlobalEvent } from '@hubai/core/esm/common/event';
import { IConfigProps } from 'mo/provider/create';
import { STORE_KEY } from 'renderer/i18n/localeService';
import { defaultExtensions } from '../extensions';

interface IInstanceServiceProps {
  getConfig: () => IConfigProps;
  render: (dom: ReactElement) => ReactElement;
  onBeforeInit: (callback: () => void) => void;
  onBeforeLoad: (callback: () => void) => void;
}

enum InstanceHookKind {
  beforeInit = 'before.init',
  beforeLoad = 'before.load',
}

export default class InstanceService
  extends GlobalEvent
  implements IInstanceServiceProps
{
  private _config = {
    extensions: defaultExtensions.concat(),
    defaultLocale: 'en',
  };

  private rendered = false;

  constructor(config: IConfigProps) {
    super();
    if (config.defaultLocale) {
      this._config.defaultLocale = config.defaultLocale;
    }

    if (Array.isArray(config.extensions)) {
      this._config.extensions.push(...config.extensions);
    }
  }

  private initialLocaleService = (languagesExts: IExtension[]) => {
    const locales = languagesExts.reduce((pre, cur) => {
      const languages = cur.contributes?.languages || [];
      return pre.concat(languages);
    }, [] as ILocale[]);

    molecule.i18n.initialize(
      locales,
      localStorage.getItem(STORE_KEY) || this._config.defaultLocale
    );
  };

  public getConfig: () => IConfigProps = () => {
    return { ...this._config };
  };

  public render = (workbench: ReactElement) => {
    if (!this.rendered) {
      this.emit(InstanceHookKind.beforeInit);

      // get all locales including builtin and custom locales
      const [languages, others] = molecule.extension.splitLanguagesExts(
        this._config.extensions
      );
      this.initialLocaleService(languages);

      const controllers = [
        'IActivityBarController',
        'IAuxiliaryController',
        'IEditorController',
        /**
         * Explorer should called before EditorTreeController,
         * @refer https://github.com/DTStack/molecule/issues/829
         */
        'IExplorerController',
        'IEditorTreeController',
        'IExtensionController',
        'IFolderTreeController',
        'ILayoutController',
        'IMenuBarController',
        'INotificationController',
        'IOutlineController',
        'IPanelController',
        'IProblemsController',
        'ISearchController',
        'ISettingsController',
        'ISidebarController',
        'IStatusBarController',
        'IAuthController',
        'IChatController',
        'IBrainController',
        'IExtensionListController',
      ];

      // resolve all controllers, and call `initView` to inject initial values into services
      Object.keys(controllers).forEach((key) => {
        const module = controllers[key];
        const controller = container.resolve<Controller>(module);
        controller.initView?.();
      });

      this.emit(InstanceHookKind.beforeLoad);
      molecule.extension.load(others);

      molecule.layout.onWorkbenchDidMount(() => {
        molecule.monacoService.initWorkspace(molecule.layout.container!);
      });
      this.rendered = true;
    }

    return workbench;
  };

  public onBeforeInit = (callback: () => void) => {
    this.subscribe(InstanceHookKind.beforeInit, callback);
  };

  public onBeforeLoad = (callback: () => void) => {
    this.subscribe(InstanceHookKind.beforeLoad, callback);
  };
}
