import { ipcRenderer } from 'electron';
import endpoints from './endpoints';
import { LocalExtensionModel } from '../domain/models/localExtension';
import { ExtensionUninstallationResult } from '../extensionInstaller';

const extensionRendererApi = {
  installExtension(extensionZipPath: string) {
    return ipcRenderer.sendSync(endpoints.install, extensionZipPath);
  },
  getInstalledExtensions(): LocalExtensionModel[] {
    return ipcRenderer.sendSync(endpoints.getAll);
  },
  uninstallExtension(
    extension: LocalExtensionModel
  ): ExtensionUninstallationResult {
    return ipcRenderer.sendSync(endpoints.uninstall, extension);
  },
};

export default extensionRendererApi;
