import { ipcRenderer } from 'electron';
import endpoints from './endpoints';

const userSettingsRendererApi = {
  // TODO: I think this might be a security issue, we shouldn't be able to get and set the settings like that because this might be used by attackers

  get(key: string) {
    return ipcRenderer.sendSync(endpoints.get, key);
  },
  getAll() {
    return ipcRenderer.sendSync(endpoints.getAll);
  },
  setSetting(property: string, val: any) {
    ipcRenderer.send(endpoints.setSetting, property, val);
  },
  set(newSettings: any) {
    ipcRenderer.send(endpoints.set, newSettings);
  },
};

export default userSettingsRendererApi;
