import { ipcMain } from 'electron';
import makeLoadLocalBrains from '../factories/usecases/loadLocalBrainsFactory';
import brainInstaller from '../brainInstaller';
import brainServerManager from '../brainServerManager';
import endpoints from './endpoints';

ipcMain.on(endpoints.getAll, async (event) => {
  const getBrainsUseCase = await makeLoadLocalBrains();
  const brains = await getBrainsUseCase.getBrains();
  event.returnValue = brains;
});

ipcMain.on(endpoints.install, async (event, brainZipPath: string) => {
  const result = await brainInstaller.installBrain(brainZipPath);
  event.returnValue = result;
});

ipcMain.on(
  endpoints.updateSettings,
  async (event, brainId: string, newSettings: any) => {
    event.returnValue = brainServerManager.updateClientSettings(
      brainId,
      newSettings
    );
  }
);
