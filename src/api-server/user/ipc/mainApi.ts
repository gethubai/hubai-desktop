import { ipcMain } from 'electron';
import endpoints from './endpoints';
import makeCurrentUserService from '../factories/currentUserServiceFactory';

ipcMain.on(endpoints.getCurrentUser, async (event) => {
  const user = await makeCurrentUserService().get();
  event.reply('set-current-user', user);
  event.returnValue = user;
});
