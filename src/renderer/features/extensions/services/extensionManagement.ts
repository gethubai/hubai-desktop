/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/destructuring-assignment */
import { IExtensionService, type ISettingsService } from '@hubai/core';
import { container, inject, injectable, singleton } from 'tsyringe';
import { Component } from '@hubai/core/esm/react';
import {
  LocalExtensionModel,
  LocalExtensionSettingMap,
} from 'api-server/extensions/domain/models/localExtension';
import { ExtensionUninstallationResult } from 'api-server/extensions/extensionInstaller';
import {
  ExtensionEvent,
  ExtensionListStateModel,
  type IExtensionListState,
} from '../models/extension';
import makeLoadLocalExtensions from '../factories/usecases/makeLoadLocalExtensions';

export interface IExtensionManagementService
  extends Component<IExtensionListState> {
  getExtensions(): LocalExtensionModel[];
  getExtensionSettings(extensionId: string): any;
  onExtensionSettingsUpdated(
    callback: (extension: LocalExtensionModel, settings: any) => void
  ): void;

  uninstallExtension(
    extension: LocalExtensionModel
  ): ExtensionUninstallationResult;
}

@singleton()
@injectable()
export class ExtensionManagementService
  extends Component<IExtensionListState>
  implements IExtensionManagementService
{
  protected state: IExtensionListState;

  constructor(
    @inject('ISettingsService') private settingsService: ISettingsService,
    @inject('IExtensionService') private extensionService: IExtensionService
  ) {
    super();
    this.state = container.resolve(ExtensionListStateModel);
    this.onExtensionSettingsUpdated(this.saveExtensionSettings.bind(this));
    this.loadExtensions();
  }

  uninstallExtension(
    extension: LocalExtensionModel
  ): ExtensionUninstallationResult {
    const result = window.electron.extension.uninstallExtension(extension);

    if (result.success) {
      try {
        this.extensionService.dispose(extension.id);
      } catch (e: any) {
        console.error(e);
        return {
          success: false,
          error: new Error(
            "The extension has been uninstalled but we couldn't dispose it, please restart the app for changes to take effect."
          ),
        };
      }
    }

    return result;
  }

  onExtensionSettingsUpdated(
    callback: (extension: LocalExtensionModel, settings: any) => void
  ): void {
    this.subscribe(ExtensionEvent.onExtensionSettingsUpdated, callback);
  }

  getExtensions(): LocalExtensionModel[] {
    return this.state.extensions;
  }

  getExtensionSettings(extensionName: string) {
    const settings = this.settingsService.getSettings();

    return settings.extension[extensionName];
  }

  async saveExtensionSettings(
    extension: LocalExtensionModel,
    newSettings: any
  ) {
    const currentSettings = this.settingsService.getSettings();
    currentSettings.extension[extension.name] = newSettings;
    this.settingsService.applySettings(currentSettings);
    this.settingsService.saveSettings();

    // TODO: Implement system to save extension settings and notify the extension about the new settings
    /* const saveExtensionSettings = await makeSaveLocalExtensionSettings();
    await saveExtensionSettings.save({
      extensionId: extension.id,
      newSettings,
    }); */
  }

  private async loadExtensions(): Promise<void> {
    const getExtensionsUseCase = await makeLoadLocalExtensions();
    const extensions = await getExtensionsUseCase.getExtensions();
    this.setState({ extensions });

    this.loadDefaultExtensionSettings();
  }

  private loadDefaultExtensionSettings(): void {
    const extensionSettings: any =
      this.settingsService.getSettings().extension || {};
    const extensions = this.getExtensions();

    extensions.forEach((extension) => {
      if (!extensionSettings[extension.name])
        extensionSettings[extension.name] = {};
      const settingsMap = extension.contributes
        ?.configuration as LocalExtensionSettingMap[];

      (settingsMap || []).forEach((setting) => {
        if (!extensionSettings[extension.name][setting.name]) {
          extensionSettings[extension.name][setting.name] =
            setting.defaultValue;
        }
      });
    });

    this.settingsService.update({ extension: extensionSettings });
    this.settingsService.saveSettings();
  }
}
