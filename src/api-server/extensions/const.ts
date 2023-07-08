import { getExtensionsStoragePath } from 'utils/pathUtils';
import path from 'path';
import { LocalExtensionModel } from './domain/models/localExtension';

export const getExtensionPath = (extension: LocalExtensionModel) => {
  return getExtensionsStoragePath(`${extension.name}-${extension.version}`);
};

export const getExtensionMainPath = (extension: LocalExtensionModel) => {
  const installationPath = getExtensionPath(extension);
  return path.join(installationPath, extension.main || 'remoteEntry.js');
};
