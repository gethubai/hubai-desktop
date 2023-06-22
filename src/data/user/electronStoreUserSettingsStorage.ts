import Store from 'electron-store';
import { IUserSettingsStorage } from './userSettingsStorage';

const USER_SETTINGS_KEY = 'user.localSettings';

export default class ElectronStoreUserSettingsStorage
  implements IUserSettingsStorage
{
  constructor(private store: Store) {
    this.store = store;
  }

  get(key: string): any {
    const value = this.getAll();
    return value ? value[key] : undefined;
  }

  getAll(): any {
    return this.store.get(USER_SETTINGS_KEY) ?? {};
  }

  setSetting(key: string, value: any): void {
    const all = this.getAll();

    this.set({ ...all, [key]: value });
  }

  set(value: any): any {
    this.store.set(USER_SETTINGS_KEY, value);
  }
}
