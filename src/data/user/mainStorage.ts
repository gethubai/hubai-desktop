import Store from 'electron-store';
import keyStore from 'data/keyStore';
import ElectronStoreUserSettingsStorage from './electronStoreUserSettingsStorage';

const userSettingsStorage = new ElectronStoreUserSettingsStorage(() => {
  return new Store({
    name: 'userSettings',
    watch: true,
    encryptionKey: keyStore.get(),
  });
});
export default userSettingsStorage;
