import { ipcRenderer } from 'electron';
import endpoints from './endpoints';

const brainRendererApi = {
  installBrain(brainZipPath: string) {
    return ipcRenderer.sendSync(endpoints.install, brainZipPath);
  },
  getInstalledBrains() {
    return ipcRenderer.sendSync(endpoints.getAll);
  },
  updateSettings(brainId: string, newSettings: any) {
    return ipcRenderer.sendSync(endpoints.updateSettings, brainId, newSettings);
  },
};

export default brainRendererApi;
