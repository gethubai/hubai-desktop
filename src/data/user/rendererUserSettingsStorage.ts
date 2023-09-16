import { IUserSettingsStorage } from './userSettingsStorage';

class RendererUserSettingsStorage implements IUserSettingsStorage {
  get(key: string): any {
    return window.electron.userSettings.get(key);
  }

  getAll(): any {
    return window.electron.userSettings.getAll();
  }

  setSetting(key: string, value: any): any {
    window.electron.userSettings.setSetting(key, value);
  }

  set(value: any) {
    window.electron.userSettings.set(value);
  }
}

export default new RendererUserSettingsStorage();
