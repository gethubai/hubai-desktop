import { ipcMain } from 'electron';
import endpoints from './endpoints';
import makeListContacts from '../factories/usecases/listContactsFactory';

ipcMain.on(endpoints.list, async (event) => {
  const listContacts = await makeListContacts();

  const contacts = await listContacts.execute();
  event.returnValue = contacts;
});
