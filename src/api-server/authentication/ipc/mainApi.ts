import { ipcMain } from 'electron';
import endpoints from './endpoints';
import makeAuthClient from '../factories/authClientFactory';

ipcMain.on(endpoints.isLoggedIn, async (event) => {
  event.returnValue = await makeAuthClient().isLoggedIn();
});

ipcMain.on(endpoints.logOut, async (event) => {
  await makeAuthClient().logout();

  event.reply('logged-out');
});

ipcMain.on(endpoints.showAuthWindow, async (event) => {
  const token = await makeAuthClient().login();
  if (token) {
    event.reply('logged-in', token);
  }
});

ipcMain.on(endpoints.getJwtToken, async (event) => {
  event.returnValue = await makeAuthClient().getAccessToken();
});
