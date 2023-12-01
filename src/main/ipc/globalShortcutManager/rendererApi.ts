import { ipcRenderer } from 'electron';
import endpoints from './endpoints';

const globalShortcutApi = {
  register(acceleratorId: string): Promise<boolean> {
    return ipcRenderer.invoke(endpoints.register, acceleratorId);
  },
  unregister(acceleratorId: string): Promise<boolean> {
    return ipcRenderer.invoke(endpoints.unregister, acceleratorId);
  },

  isRegistered(acceleratorId: string): Promise<boolean> {
    return ipcRenderer.invoke(endpoints.isRegistered, acceleratorId);
  },
};

export default globalShortcutApi;
