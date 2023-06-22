import rendererUserSettingsStorage from 'data/user/rendererUserSettingsStorage';
import { ISettings } from 'mo/model';
import { SettingsService } from 'mo/services';
import { container } from 'tsyringe';

const settingsService = container.resolve(SettingsService);

const localUserSettings = rendererUserSettingsStorage.getAll();

console.log('localUserSettings', localUserSettings);

if (localUserSettings) {
  settingsService.update(localUserSettings as ISettings);
}

settingsService.onSettingsSaved((settings) => {
  rendererUserSettingsStorage.set(settings);
});
