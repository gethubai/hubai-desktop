// In the app, if window.isElectron is defined and true, we know we're running in Electron
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  BrainIpcApiConfigs,
  MediaAccessIpcApiConfigs,
  UserSettingsIpcApiConfigs,
} from './consts';

Object.defineProperty(window, 'isRenderer', { get: () => true });

export type Channels = 'ipc-example';

const electronHandler = {
  restart: () => ipcRenderer.send('restart-app'),
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
      return ipcRenderer.sendSync(UserSettingsIpcApiConfigs.endpoints.get, key);
    },
    getAll() {
      return ipcRenderer.sendSync(UserSettingsIpcApiConfigs.endpoints.getAll);
    },
    setSetting(property: string, val: any) {
      ipcRenderer.send(
        UserSettingsIpcApiConfigs.endpoints.setSetting,
        property,
        val
      );
    },
    set(newSettings: any) {
      ipcRenderer.send(UserSettingsIpcApiConfigs.endpoints.set, newSettings);
    },
  },
  brain: {
    installBrain(brainZipPath: string) {
      return ipcRenderer.sendSync(
        BrainIpcApiConfigs.endpoints.install,
        brainZipPath
      );
    },
    getInstalledBrains() {
      return ipcRenderer.sendSync(BrainIpcApiConfigs.endpoints.getAll);
    },
    updateSettings(brainId: string, newSettings: any) {
      return ipcRenderer.sendSync(
        BrainIpcApiConfigs.endpoints.updateSettings,
        brainId,
        newSettings
      );
    },
  },
  mediaAccess: {
    async getMicrophoneAccessStatus() {
      return ipcRenderer.sendSync(
        MediaAccessIpcApiConfigs.endpoints.getMicrophoneAccessStatus,
        'microphone'
      );
    },

    async askForMicrophoneAccess() {
      return ipcRenderer.sendSync(
        MediaAccessIpcApiConfigs.endpoints.askForMicrophoneAccess,
        'microphone'
      );
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
