import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export const getAppDataStoragePath = (append: string) =>
  path.normalize(`${app.getPath('userData')}/${append}`);

export const getMessageStoragePath = (append: string) =>
  getAppDataStoragePath(`chat/messages/${append}`);

export const getMessageAudioStoragePath = (append: string) =>
  getMessageStoragePath(`audio/${append}`);

export const createDirectoryIfNotExists = (directoryPath: string) => {
  try {
    fs.mkdirSync(directoryPath, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
};
