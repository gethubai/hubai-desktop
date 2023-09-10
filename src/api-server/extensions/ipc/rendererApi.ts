import { ipcRenderer } from 'electron';
import endpoints from './endpoints';
import { LocalExtensionModel } from '../domain/models/localExtension';
import {
  ExtensionInstallationResult,
  ExtensionUninstallationResult,
} from '../models/installation';

const extensionRendererApi = {
  installExtension(extensionZipPath: string): ExtensionInstallationResult {
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
