import { container, inject, injectable } from 'tsyringe';
import { ErrorMsg } from '@hubai/core/esm/common/error';
import {
  AppContext,
  ExtensionContext,
  IContribute,
  IContributeType,
  IExtension,
  type IExtensionService,
} from '@hubai/core';
import { IColorTheme } from '@hubai/core/esm/model/colorTheme';
import { type ILocaleService, ILocale } from '@hubai/core/esm/i18n';
import logger from '@hubai/core/esm/common/logger';
import { IDisposable } from '@hubai/core/esm/monaco/common';
import { type IMonacoService } from '@hubai/core/esm/monaco/monacoService';

import { searchById } from '@hubai/core/esm/common/utils';
import type { UniqueId } from '@hubai/core/esm/common/types';
import { Action2 } from '@hubai/core/esm/monaco/action';
import { type IColorThemeService } from '@hubai/core/esm/services/theme/colorThemeService';
import { registerAction2 } from 'mo/monaco/action';
import { loadComponent } from 'renderer/common/dynamicModule';
import { type IChatContribute } from '@hubai/core/esm/model/chat';
import { type IChatService } from 'renderer/features/chat/services/types';
import { ExtensionPackageSettingsService } from 'renderer/features/packages/services/packageSettingsService';
import { IExtensionManagementService } from 'renderer/features/extensions/services/extensionManagement';

@injectable()
class ExtensionService implements IExtensionService {
  private extensions: IExtension[] = [];

  private appContext: AppContext | undefined;

  // eslint-disable-next-line @typescript-eslint/ban-types
  private _inactive: Function | undefined;

  /**
   * TODO: This property is used for marking the extensions were loaded
   * we are going to refactor this logic after redesign the Molecule lifecycle.
   */
  private _isLoaded = false;

  constructor(
    @inject('IColorThemeService')
    private readonly colorThemeService: IColorThemeService,
    @inject('IMonacoService') private readonly monacoService: IMonacoService,
    @inject('ILocaleService') private readonly localeService: ILocaleService,
    @inject('IChatService') private readonly chatService: IChatService
  ) {}

  public setLoaded(flag?: boolean): void {
    this._isLoaded = flag !== undefined ? flag : true;
  }

  public isLoaded(): boolean {
    return this._isLoaded;
  }

  public getExtension(id: UniqueId): IExtension | undefined {
    return this.extensions.find(searchById(id));
  }

  public reset(): void {
    this.extensions = [];
  }

  public getAllExtensions(): IExtension[] {
    return this.extensions.concat();
  }

  public static async loadFromSystem(
    extensionName: string
  ): Promise<IExtension> {
    const extensionUrl = extensionName.startsWith('http')
      ? extensionName
      : `plugins://${extensionName}`;

    const res = await loadComponent(extensionUrl, 'my-plugin', './Module')();

    return res.default;
  }

  public add(extensions: IExtension[]): IExtension[] | null {
    if (!extensions || extensions?.length === 0) return null;
    /**
     * Filtered the exist Extensions
     */
    const unloadExtensions = extensions.filter((ext) => {
      const isExist = this.extensions.find(searchById(ext.id));
      if (isExist) {
        logger.warn(`Warning: Unable to load the existed Extension:${ext.id}`);
      }
      return !isExist;
    });
    if (unloadExtensions.length > 0) {
      this.extensions = this.extensions.concat(unloadExtensions);
    }
    return unloadExtensions;
  }

  public load(extensions: IExtension[]) {
    try {
      // First add the extensions
      const unloadExtensions = this.add(extensions);
      if (!unloadExtensions) return;

      // Then activate
      this.activate(unloadExtensions);
    } catch (e) {
      logger.error(ErrorMsg.LoadExtensionFail, e);
    }
  }

  public loadContributes(contributes: IContribute) {
    const contributeKeys = Object.keys(contributes);
    contributeKeys.forEach((type: string) => {
      switch (type) {
        case IContributeType.Themes: {
          const themes: IColorTheme[] | undefined = contributes[type];
          if (!themes) return;
          this.colorThemeService.addThemes(themes);
          break;
        }
        case IContributeType.Languages: {
          const locales: ILocale[] | undefined = contributes[type];
          if (!locales) return;
          this.localeService.addLocales(locales);
          break;
        }
        case IContributeType.Chat: {
          const chat: IChatContribute | undefined = contributes[type];
          if (!chat) return;

          if (chat.commands)
            this.chatService.addCompletionCommand(chat.commands);

          break;
        }
        default:
          break;
      }
    });
  }

  public registerAction(ActionClass: { new (): Action2 }): IDisposable {
    return registerAction2(ActionClass);
  }

  public executeCommand(id: any, ...args: any[]) {
    this.monacoService.commandService.executeCommand(id, ...args);
  }

  public activate(extensions: IExtension[]): void {
    if (extensions.length === 0) return;

    const appContext = this.getContext();
    const packageManagement = container.resolve<IExtensionManagementService>(
      'IExtensionManagementService'
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extensions?.forEach((extension: IExtension, index: number) => {
      // Ignore the inactive or invalid extension
      if (!extension || this.isInactive(extension)) return;

      const extensionContext = new ExtensionContext(
        new ExtensionPackageSettingsService(extension, packageManagement)
      );

      if (extension.activate) {
        extension.activate(appContext, extensionContext);
      }

      if (extension.contributes) {
        this.loadContributes(extension.contributes);
      }
    });
  }

  public getContext(): AppContext {
    if (!this.appContext) {
      this.appContext = container.resolve<AppContext>('AppContext');
    }
    return this.appContext;
  }

  public dispose(extensionId: UniqueId): void {
    const ctx = this.getContext();
    const extIndex = this.extensions.findIndex(searchById(extensionId));
    if (extIndex > -1) {
      const extension: IExtension = this.extensions[extIndex];
      extension.dispose?.(ctx);
      this.extensions.splice(extIndex, 1);
    }
  }

  public disposeAll() {
    const ctx = this.getContext();
    this.extensions.forEach((ext) => {
      ext.dispose?.(ctx);
    });
    this.reset();
  }

  public inactive(predicate: (extension: IExtension) => boolean): void {
    this._inactive = predicate;
  }

  private isInactive(extension: IExtension): boolean {
    if (this._inactive && typeof this._inactive === 'function') {
      return this._inactive(extension);
    }
    return false;
  }

  public splitLanguagesExts(
    extensions: IExtension[]
  ): [IExtension[], IExtension[]] {
    const languagesExts: IExtension[] = [];
    const others: IExtension[] = [];
    extensions.forEach((ext) => {
      if (ext.contributes?.languages && ext.contributes?.languages.length > 0) {
        languagesExts.push(ext);
      } else {
        others.push(ext);
      }
    });

    return [languagesExts, others];
  }
}

export default ExtensionService;
