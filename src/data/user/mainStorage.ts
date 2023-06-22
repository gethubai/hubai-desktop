import Store from 'electron-store';
import ElectronStoreUserSettingsStorage from './electronStoreUserSettingsStorage';

const store = new Store();

const userSettingsStorage = new ElectronStoreUserSettingsStorage(store);
export default userSettingsStorage;
