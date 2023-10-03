/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/destructuring-assignment */
import { IExtensionService, type ISettingsService } from '@hubai/core';
import { container, inject, injectable, singleton } from 'tsyringe';
import { isEqual } from 'lodash';
import { Component } from '@hubai/core/esm/react';
import {
  LocalExtensionModel,
  LocalExtensionSettingMap,
} from 'api-server/extensions/domain/models/localExtension';
import {
  ILocalPackageManagementService,
  PackageInstallationResult,
  PackageUninstallationResult,
} from 'renderer/features/packages/models/localPackageManagementService';
import { PackageType } from 'renderer/features/packages/models/package';
import {
  ExtensionEvent,
  ExtensionListStateModel,
  type IExtensionListState,
} from '../models/extension';
import makeLoadLocalExtensions from '../factories/usecases/makeLoadLocalExtensions';

export interface IExtensionManagementService
  extends Component<IExtensionListState>,
    ILocalPackageManagementService<LocalExtensionModel> {}

@singleton()
@injectable()
export class ExtensionManagementService
  extends Component<IExtensionListState>
  implements IExtensionManagementService
{
  protected state: IExtensionListState;

  public packageType: PackageType = PackageType.Extension;

  constructor(
    @inject('ISettingsService') private settingsService: ISettingsService,
    @inject('IExtensionService') private extensionService: IExtensionService
  ) {
    super();
    this.state = container.resolve(ExtensionListStateModel);
    this.onPackageSettingsUpdated(this.saveExtensionSettings.bind(this));
    this.loadExtensions();
  }

  getPackagesAsync = async (): Promise<LocalExtensionModel[]> => {
    if (this.state.extensions && this.state.extensions.length > 0)
      return Promise.resolve(this.state.extensions);

    const getExtensionsUseCase = await makeLoadLocalExtensions();
    return getExtensionsUseCase.getExtensions();
  };

  installPackage = (
    extensionPath: string
  ): PackageInstallationResult<LocalExtensionModel> => {
    const result = window.electron.extension.installExtension(extensionPath);

    if (result.success && result.extension) {
      const packages = this.getPackages();

      const packageIndex = packages.findIndex(
        (e) => e.name.toLowerCase() === result.extension?.name.toLowerCase()
      );

      if (packageIndex !== -1) packages[packageIndex] = result.extension;
      else packages.push(result.extension);

      this.setState({
        extensions: packages,
      });

      this.emit(ExtensionEvent.onExtensionInstalled, result.extension);
    }

    return result;
  };

  uninstallPackage(
    extension: LocalExtensionModel
  ): PackageUninstallationResult {
    const result = window.electron.extension.uninstallExtension(extension);

    if (result.success) {
      try {
        this.extensionService.dispose(extension.id);
        this.removeExtensionSettings(extension);
        this.setState({
          extensions: this.getPackages().filter((p) => p.id !== extension.id),
        });
        this.emit(ExtensionEvent.onExtensionUninstalled, extension);
      } catch (e: any) {
        console.error('exception on uninstall extension', e);
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

  onPackageInstalled(callback: (extension: LocalExtensionModel) => void) {
    this.subscribe(ExtensionEvent.onExtensionInstalled, callback);
  }

  onPackageUninstalled(callback: (extension: LocalExtensionModel) => void) {
    this.subscribe(ExtensionEvent.onExtensionUninstalled, callback);
  }

  onPackageSettingsUpdated(
    callback: (extension: LocalExtensionModel, settings: any) => void
  ): void {
    this.subscribe(ExtensionEvent.onExtensionSettingsUpdated, callback);
  }

  getPackageByName(name: string): LocalExtensionModel | undefined {
    return this.getPackages().find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
  }

  getPackages(): LocalExtensionModel[] {
    return this.state.extensions ?? [];
  }

  getPackageSettings(extensionName: string) {
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

  removeExtensionSettings(extension: LocalExtensionModel) {
    const settings = this.settingsService.getSettings();
    delete settings.extension[extension.name];
    this.settingsService.applySettings(settings);
    this.settingsService.saveSettings();
  }

  private async loadExtensions(): Promise<void> {
    const extensions = await this.getPackagesAsync();
    this.setState({ extensions });

    this.loadDefaultExtensionSettings();
  }

  private loadDefaultExtensionSettings(): void {
    const extensionSettings: any = {
      ...(this.settingsService.getSettings().extension ?? {}),
    };
    const extensions = this.getPackages();

    extensions.forEach((extension) => {
      if (!extensionSettings[extension.name])
        extensionSettings[extension.name] = {};
      const settingsMap = extension.contributes
        ?.configuration as LocalExtensionSettingMap[];

      (settingsMap || [])
        .filter((s) => s.defaultValue !== undefined)
        .forEach((setting) => {
          if (!extensionSettings[extension.name][setting.name]) {
            extensionSettings[extension.name][setting.name] =
              setting.defaultValue;
          }
        });
    });

    const current = this.settingsService.getSettings().extension;
    if (!isEqual(current, extensionSettings)) {
      this.settingsService.update({ extension: extensionSettings });
      this.settingsService.saveSettings();
    }
  }
}
