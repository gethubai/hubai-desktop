import { ISettings, ISettingsService } from '@hubai/core';
import rendererUserSettingsStorage from 'data/user/rendererUserSettingsStorage';
import { container } from 'tsyringe';

const settingsService = container.resolve<ISettingsService>('ISettingsService');

const localUserSettings = rendererUserSettingsStorage.getAll();

if (localUserSettings) {
  settingsService.update(localUserSettings as ISettings);
}

settingsService.onSettingsSaved((settings) => {
  rendererUserSettingsStorage.set(settings);
});
