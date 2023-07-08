import { ipcRenderer } from 'electron';
import endpoints from './endpoints';
import { LocalExtensionModel } from '../domain/models/localExtension';

const extensionRendererApi = {
  installExtension(extensionZipPath: string) {
    return ipcRenderer.sendSync(endpoints.install, extensionZipPath);
  },
  getInstalledExtensions(): LocalExtensionModel[] {
    return ipcRenderer.sendSync(endpoints.getAll);
  },
};

export default extensionRendererApi;
