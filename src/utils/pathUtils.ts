import { app } from 'electron';
import path from 'path';

export const getAppDataStoragePath = (append: string) =>
  path.normalize(`${app.getPath('appData')}/allai-app/${append}`);

export const getMessageStoragePath = (append: string) =>
  getAppDataStoragePath(`messages/${append}`);

export const getMessageAudioStoragePath = (append: string) =>
  getMessageStoragePath(`audio/${append}`);
