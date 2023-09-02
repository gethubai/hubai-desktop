import { ipcMain } from 'electron';
import endpoints from './endpoints';
import makeLoadLocalExtensions from '../factories/usecases/loadLocalExtensionsFactory';
import extensionInstaller from '../extensionInstaller';
import { LocalExtensionModel } from '../domain/models/localExtension';

ipcMain.on(endpoints.getAll, async (event) => {
  const getExtensionsUseCase = await makeLoadLocalExtensions();
  const extensions = await getExtensionsUseCase.getExtensions();
  event.returnValue = extensions;
});

ipcMain.on(endpoints.install, async (event, extensionZipPath: string) => {
  const result = await extensionInstaller.installExtension(extensionZipPath);
  event.returnValue = result;
});

ipcMain.on(
  endpoints.uninstall,
  async (event, extension: LocalExtensionModel) => {
    const result = await extensionInstaller.uninstall(extension);
    event.returnValue = result;
  }
);
