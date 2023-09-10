import { ipcRenderer } from 'electron';
import endpoints from './endpoints';
import {
  BrainInstallationResult,
  BrainUninstallationResult,
} from '../models/brainInstallationResult';
import { LocalBrainModel } from '../domain/models/localBrain';

const brainRendererApi = {
  installBrain(brainZipPath: string): BrainInstallationResult {
    return ipcRenderer.sendSync(endpoints.install, brainZipPath);
  },
  uninstallBrain(brain: LocalBrainModel): BrainUninstallationResult {
    return ipcRenderer.sendSync(endpoints.uninstall, brain);
  },
  getInstalledBrains() {
    return ipcRenderer.sendSync(endpoints.getAll);
  },
  updateSettings(brainId: string, newSettings: any) {
    return ipcRenderer.sendSync(endpoints.updateSettings, brainId, newSettings);
  },
};

export default brainRendererApi;
