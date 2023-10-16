import { container, inject, injectable } from 'tsyringe';
import { ErrorMsg } from '@hubai/core/esm/common/error';
import {
  AppContext,
  AppContextServices,
  IContribute,
  IContributeType,
  IExtension,
  ISidebarService,
  type IExtensionService,
  IActivityBarService,
  IMenuBarService,
  IEditorService,
  INotificationService,
  IProblemsService,
  ISettingsService,
  ILayoutService,
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

@injectable()
class ExtensionService implements IExtensionService {
  private extensions: IExtension[] = [];

  private _inactive: Function | undefined;

  /**
   * TODO: This property is used for marking the extensions were loaded
   * we are going to refactor this logic after redesign the Molecule lifecycle.
   */
  private _isLoaded: boolean = false;

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

  public executeCommand(id, ...args) {
    this.monacoService.commandService.executeCommand(id, ...args);
  }

  public activate(extensions: IExtension[]): void {
    if (extensions.length === 0) return;

    const ctx = this.createContext();
    extensions?.forEach((extension: IExtension, index: number) => {
      // Ignore the inactive or invalid extension
      if (!extension || this.isInactive(extension)) return;

      if (extension.activate) {
        extension.activate(ctx);
      }

      if (extension.contributes) {
        this.loadContributes(extension.contributes);
      }
    });
  }

  private createContext(): AppContext {
    const services = new AppContextServices(
      container.resolve<ISidebarService>('ISidebarService'),
      container.resolve<IActivityBarService>('IActivityBarService'),
      container.resolve<IMenuBarService>('IMenuBarService'),
      container.resolve<IEditorService>('IEditorService'),
      container.resolve<INotificationService>('INotificationService'),
      container.resolve<IColorThemeService>('IColorThemeService'),
      container.resolve<IProblemsService>('IProblemsService'),
      container.resolve<ISettingsService>('ISettingsService'),
      container.resolve<IExtensionService>('IExtensionService'),
      container.resolve<ILayoutService>('ILayoutService')
    );
    return new AppContext(services);
  }

  public dispose(extensionId: UniqueId): void {
    const ctx = this.createContext();
    const extIndex = this.extensions.findIndex(searchById(extensionId));
    if (extIndex > -1) {
      const extension: IExtension = this.extensions[extIndex];
      extension.dispose?.(ctx);
      this.extensions.splice(extIndex, 1);
    }
  }

  public disposeAll() {
    const ctx = this.createContext();
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
