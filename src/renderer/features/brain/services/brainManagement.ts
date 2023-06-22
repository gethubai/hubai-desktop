/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/destructuring-assignment */
import { Component } from 'mo/react';
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { container, singleton } from 'tsyringe';
import { ISettingsService, SettingsService } from 'mo/services';
import makeSaveLocalBrainSettings from 'api-server/brain/factories/usecases/saveLocalBrainSettingsFactory';
import makeLoadLocalBrains from 'api-server/brain/factories/usecases/loadLocalBrainsFactory';
import { BrainEvent, BrainStateModel, IBrainState } from '../models/brain';

export interface IBrainManagementService extends Component<IBrainState> {
  getBrains(): LocalBrainModel[];
  getBrainSettings(brainId: string): any;
  onBrainSettingsUpdated(
    callback: (brain: LocalBrainModel, settings: any) => void
  ): void;
}

@singleton()
export class BrainManagementService
  extends Component<IBrainState>
  implements IBrainManagementService
{
  protected state: IBrainState;

  private readonly settingsService: ISettingsService;

  constructor() {
    super();
    this.state = container.resolve(BrainStateModel);
    this.settingsService = container.resolve(SettingsService);
    this.onBrainSettingsUpdated(this.saveBrainSettings.bind(this));

    this.loadBrains();
  }

  onBrainSettingsUpdated(
    callback: (brain: LocalBrainModel, settings: any) => void
  ): void {
    this.subscribe(BrainEvent.onBrainSettingsUpdated, callback);
  }

  getBrains(): LocalBrainModel[] {
    return this.state.brains;
  }

  getBrainSettings(brainName: string) {
    const settings = this.settingsService.getSettings();

    return settings.brain[brainName];
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
    const brainSettings: any = this.settingsService.getSettings().brain || {};
    const brains = this.getBrains();

    brains.forEach((brain) => {
      if (!brainSettings[brain.name]) brainSettings[brain.name] = {};

      (brain.settingsMap || []).forEach((setting) => {
        if (!brainSettings[brain.name][setting.name]) {
          brainSettings[brain.name][setting.name] = setting.defaultValue;
        }
      });
    });

    this.settingsService.update({ brain: brainSettings });
    this.settingsService.saveSettings();
  }
}
