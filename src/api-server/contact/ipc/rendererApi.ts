import { ipcRenderer } from 'electron';
import endpoints from './endpoints';
import { Contact } from '../domain/models/contact';

const contactRendererApi = {
  listContacts(): Contact[] {
    return ipcRenderer.sendSync(endpoints.list);
  },
};

export default contactRendererApi;
