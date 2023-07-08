import { ipcMain } from 'electron';
import endpoints from './endpoints';
import makeLoadLocalExtensions from '../factories/usecases/loadLocalExtensionsFactory';
import extensionInstaller from '../extensionInstaller';

ipcMain.on(endpoints.getAll, async (event) => {
  const getExtensionsUseCase = await makeLoadLocalExtensions();
  const extensions = await getExtensionsUseCase.getExtensions();
  event.returnValue = extensions;
});

ipcMain.on(endpoints.install, async (event, extensionZipPath: string) => {
  const result = await extensionInstaller.installExtension(extensionZipPath);
  event.returnValue = result;
});
