import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export const getAppDataStoragePath = (append: string) =>
  path.normalize(`${app.getPath('userData')}/${append}`);

export const getAppDatabaseStoragePath = (append: string) =>
  getAppDataStoragePath(`db/${append}`);

export const getMessageStoragePath = (append: string) =>
  getAppDataStoragePath(`chat/messages/${append}`);

/*
 * Receives an url like msg://media/1.png and returns the path to the file
 * @param url - The url to the file
 * @returns The absolute path to the file
 * */
export const getMessageStoragePathFromUrl = (url: string) => {
  // msg://media/1.png
  const urlParts = url.split('://');
  const storagePath = urlParts[1];
  return getMessageStoragePath(storagePath);
};

export const getMessageAudioStoragePath = (append: string) =>
  getMessageStoragePath(`audio/${append}`);

export const getMessageMediaStoragePath = (append: string) =>
  getMessageStoragePath(`media/${append}`);

export const getMessageFilesStoragePath = (append: string) =>
  getMessageStoragePath(`file/${append}`);

export const getPackagesStoragePath = (append: string) =>
  getAppDataStoragePath(`local-packages/${append}`);

export const getBrainsStoragePath = (append: string) =>
  getPackagesStoragePath(append);

export const getExtensionsStoragePath = (append: string) =>
  getPackagesStoragePath(append);

export const createDirectoryIfNotExists = (directoryPath: string) => {
  try {
    fs.mkdirSync(directoryPath, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
};

export const getDownloadsPath = () => {
  const downloadPath = path.normalize(`${app.getPath('temp')}/hubai/downloads`);
  createDirectoryIfNotExists(downloadPath);
  return downloadPath;
};
