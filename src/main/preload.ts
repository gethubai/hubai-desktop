// In the app, if window.isElectron is defined and true, we know we're running in Electron
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

Object.defineProperty(window, 'isRenderer', { get: () => true });

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  userSettings: {
    // TODO: I think this might be a security issue, we shouldn't be able to get and set the settings like that because this might be used by attackers
    get(key: string) {
      return ipcRenderer.sendSync('user-settings-get', key);
    },
    getAll() {
      return ipcRenderer.sendSync('user-settings-getAll');
    },
    setSetting(property: string, val: any) {
      ipcRenderer.send('user-settings-setSetting', property, val);
    },
    set(newSettings: any) {
      ipcRenderer.send('user-settings-set', newSettings);
    },
    // Other method you want to add like has(), reset(), etc.
  },
  brain: {
    updateSettings(brainId: string, newSettings: any) {
      return ipcRenderer.sendSync(
        'update-brain-settings',
        brainId,
        newSettings
      );
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
