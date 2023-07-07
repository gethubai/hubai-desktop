import userSettingsStorage from 'data/user/mainStorage';
import { ipcMain } from 'electron';
import endpoints from './endpoints';

ipcMain.on(endpoints.set, async (event, val) => {
  userSettingsStorage.set(val);
});

ipcMain.on(endpoints.get, async (event, val) => {
  event.returnValue = userSettingsStorage.get(val);
});

ipcMain.on(endpoints.getAll, async (event) => {
  event.returnValue = userSettingsStorage.getAll();
});

ipcMain.on(endpoints.setSetting, async (event, key, val) => {
  userSettingsStorage.setSetting(key, val);
});
