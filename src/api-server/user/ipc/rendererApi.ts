import { ipcRenderer } from 'electron';
import endpoints from './endpoints';

const currentUserRendererApi = {
  get() {
    return ipcRenderer.sendSync(endpoints.getCurrentUser);
  },
};

export default currentUserRendererApi;
