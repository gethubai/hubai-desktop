import { ipcRenderer } from 'electron';
import endpoints from './endpoints';

const authRendererApi = {
  showAuthWindow() {
    ipcRenderer.send(endpoints.showAuthWindow);
  },
  async logout() {
    return ipcRenderer.send(endpoints.logOut);
  },

  getJwtToken() {
    return ipcRenderer.sendSync(endpoints.getJwtToken);
  },

  isLoggedIn() {
    return ipcRenderer.sendSync(endpoints.isLoggedIn);
  },
};

export default authRendererApi;
