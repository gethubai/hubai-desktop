import { BrowserWindow, globalShortcut, ipcMain } from 'electron';
import endpoints from './endpoints';

export const registerShortcutsHandlersForWindow = (window: BrowserWindow) => {
  ipcMain.handle(endpoints.register, async (event, acceleratorId) => {
    try {
      const result = globalShortcut.register(acceleratorId, () => {
        console.log(`${acceleratorId} has been pressed`);
        window.webContents.send('global-shortcut-pressed', acceleratorId);
      });

      return result;
    } catch (e) {
      console.error('Error registering shortcut', e);
    }

    return false;
  });

  ipcMain.handle(endpoints.unregister, async (event, acceleratorId) => {
    try {
      const result = globalShortcut.unregister(acceleratorId);

      return result;
    } catch (e) {
      console.error('Could not unregister shortcut:', e);
    }
    return false;
  });

  ipcMain.handle(endpoints.isRegistered, async (event, acceleratorId) => {
    try {
      const result = globalShortcut.isRegistered(acceleratorId);
      return result;
    } catch (e) {
      console.error('Error checking if shortcut is registered', e);
    }
    return false;
  });
};
