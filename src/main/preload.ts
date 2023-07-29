// In the app, if window.isElectron is defined and true, we know we're running in Electron
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import brainRendererApi from 'api-server/brain/ipc/rendererApi';
import extensionRendererApi from 'api-server/extensions/ipc/rendererApi';
import currentUserRendererApi from 'api-server/user/ipc/rendererApi';
import userSettingsRendererApi from './ipc/userSettings/rendererApi';
import mediaAccessRendererApi from './ipc/mediaAccess/rendererApi';
import authRendererApi from '../api-server/authentication/ipc/rendererApi';

Object.defineProperty(window, 'isRenderer', { get: () => true });

export type Channels = 'logged-out' | 'logged-in' | 'set-current-user';

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
  userSettings: userSettingsRendererApi,
  brain: brainRendererApi,
  mediaAccess: mediaAccessRendererApi,
  extension: extensionRendererApi,
  auth: authRendererApi,
  currentUser: currentUserRendererApi,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
