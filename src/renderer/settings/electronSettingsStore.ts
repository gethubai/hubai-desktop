import { ISettingsService } from '@hubai/core';
import rendererUserSettingsStorage from 'data/user/rendererUserSettingsStorage';
import { container } from 'tsyringe';

const settingsService = container.resolve<ISettingsService>('ISettingsService');

settingsService.onSettingsSaved((settings) => {
  rendererUserSettingsStorage.set(settings);
});
