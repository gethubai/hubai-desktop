/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/destructuring-assignment */
import { type ISettingsService } from '@hubai/core';
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { container, inject, injectable, singleton } from 'tsyringe';
import { Component } from '@hubai/core/esm/react';
import {
  ILocalPackageManagementService,
  PackageInstallationResult,
  PackageUninstallationResult,
} from 'renderer/features/packages/models/localPackageManagementService';
import { PackageType } from 'renderer/features/packages/models/package';
import { isEqual } from 'lodash';
import { BrainEvent, BrainStateModel, type IBrainState } from '../models/brain';
import makeLoadLocalBrains from '../factories/usecases/makeLoadLocalBrains';
import makeSaveLocalBrainSettings from '../factories/usecases/makeSaveLocalBrainSettings';

export interface IBrainManagementService
  extends Component<IBrainState>,
    ILocalPackageManagementService<LocalBrainModel> {}

@singleton()
@injectable()
export class BrainManagementService
  extends Component<IBrainState>
  implements IBrainManagementService
{
  protected state: IBrainState;

  public packageType: PackageType = PackageType.Brain;

  constructor(
    @inject('ISettingsService') private settingsService: ISettingsService
  ) {
    super();
    this.state = container.resolve(BrainStateModel);
    this.onPackageSettingsUpdated(this.saveBrainSettings.bind(this));
    this.loadBrains();
  }

  onPackageInstalled(callback: (brain: LocalBrainModel) => void): void {
    this.subscribe(BrainEvent.onBrainInstalled, callback);
  }

  onPackageUninstalled(callback: (brain: LocalBrainModel) => void): void {
    this.subscribe(BrainEvent.onBrainUninstalled, callback);
  }

  installPackage(
    brainPath: string
  ): PackageInstallationResult<LocalBrainModel> {
    const result = window.electron.brain.installBrain(brainPath);

    if (result.success && result.result) {
      const brains = this.getPackages();

      const brainIndex = brains.findIndex(
        (e) => e.name.toLowerCase() === result.result?.name.toLowerCase()
      );

      if (brainIndex !== -1) brains[brainIndex] = result.result;
      else brains.push(result.result);

      this.setState({ brains });

      this.emit(BrainEvent.onBrainInstalled, result.result);
    }

    return result;
  }

  uninstallPackage(brain: LocalBrainModel): PackageUninstallationResult {
    const result = window.electron.brain.uninstallBrain(brain);

    if (result.success) {
      this.removeBrainSettings(brain);
      this.setState({
        brains: this.getPackages().filter((b) => b.id !== brain.id),
      });
      this.emit(BrainEvent.onBrainUninstalled, brain);
    }

    return result;
  }

  onPackageSettingsUpdated(
    callback: (brain: LocalBrainModel, settings: any) => void
  ): void {
    this.subscribe(BrainEvent.onBrainSettingsUpdated, callback);
  }

  getPackageByName(name: string): LocalBrainModel | undefined {
    return this.getPackages().find(
      (b) => b.name.toLowerCase() === name.toLowerCase()
    );
  }

  getPackages(): LocalBrainModel[] {
    return this.state.brains ?? [];
  }

  getPackageSettings(brainId: string) {
    const brain = this.getPackages().find((b) => b.id === brainId);
    if (!brain)
      throw new Error(`Brain with id ${brainId} not found in brains list`);

    const settings = this.settingsService.getSettings();

    return settings.brain[brain?.name];
  }

  removeBrainSettings(brain: LocalBrainModel) {
    const settings = this.settingsService.getSettings();
    delete settings.extension[brain.name];
    this.settingsService.applySettings(settings);
    this.settingsService.saveSettings();
  }

  async saveBrainSettings(brain: LocalBrainModel, newSettings: any) {
    const currentSettings = this.settingsService.getSettings();
    currentSettings.brain[brain.name] = newSettings;
    this.settingsService.applySettings(currentSettings);
    this.settingsService.saveSettings();

    const saveBrainSettings = await makeSaveLocalBrainSettings();
    await saveBrainSettings.save({
      brainId: brain.id,
      newSettings,
    });
  }

  private async loadBrains(): Promise<void> {
    const getBrainsUseCase = await makeLoadLocalBrains();
    const brains = await getBrainsUseCase.getBrains();
    this.setState({ brains });

    this.loadDefaultBrainSettings();
  }

  private loadDefaultBrainSettings(): void {
    const brainSettings: any = {
      ...(this.settingsService.getSettings().brain ?? {}),
    };
    const brains = this.getPackages();

    brains.forEach((brain) => {
      if (!brainSettings[brain.name]) brainSettings[brain.name] = {};

      (brain.settingsMap || [])
        .filter((s) => s.defaultValue !== undefined)
        .forEach((setting) => {
          if (!brainSettings[brain.name][setting.name]) {
            brainSettings[brain.name][setting.name] = setting.defaultValue;
          }
        });
    });

    const current = this.settingsService.getSettings().brain;
    if (!isEqual(current, brainSettings)) {
      this.settingsService.update({ brain: brainSettings });
      this.settingsService.saveSettings();
    }
  }
}
