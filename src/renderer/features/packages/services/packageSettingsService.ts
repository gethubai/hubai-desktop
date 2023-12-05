import { IExtension, IPackageSettingsService } from '@hubai/core';
import { EventBus, EventEmitter } from '@hubai/core/esm/common/event';
import { ExtensionEvent } from 'renderer/features/extensions/models/extension';
import { IExtensionManagementService } from 'renderer/features/extensions/services/extensionManagement';

export class ExtensionPackageSettingsService
  implements IPackageSettingsService
{
  private eventEmitter: EventEmitter;
  constructor(
    private readonly extension: IExtension,
    private readonly extensionManagementService: IExtensionManagementService
  ) {
    this.eventEmitter = new EventEmitter();

    this.extensionManagementService.onPackageSettingsUpdated(
      (extension, settings) => {
        if (extension.id === this.extension.id) {
          this.eventEmitter.emit('settingsUpdated', settings);
        }
      }
    );
  }

  get<TSettings = any>(): TSettings {
    return this.extensionManagementService.getPackageSettings(
      this.extension.name
    );
  }

  save<TSettings = any>(settings: TSettings): void {
    EventBus.emit(
      ExtensionEvent.onExtensionSettingsUpdated,
      this.extension,
      settings
    );
  }

  onUpdated<TSettings = any>(callback: (settings: TSettings) => void): void {
    this.eventEmitter.subscribe('settingsUpdated', callback);
  }
}
