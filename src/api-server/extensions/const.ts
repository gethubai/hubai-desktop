import path from 'path';
import fs from 'fs';

import { getExtensionsStoragePath } from 'utils/pathUtils';
import { ILocalExtensionDto } from 'data/extension/localExtensionRepository';
import { LocalExtensionModel } from './domain/models/localExtension';

export const getExtensionPath = (extension: LocalExtensionModel) => {
  return getExtensionsStoragePath(`${extension.name}-${extension.version}`);
};

export const getExtensionMainPath = (extension: LocalExtensionModel) => {
  const installationPath = getExtensionPath(extension);
  return path.join(installationPath, extension.main || 'remoteEntry.js');
};

export const getExtensionManifest = (extension: ILocalExtensionDto) => {
  const manifestPath = path.join(
    getExtensionPath(extension as any),
    'manifest.json'
  );

  const rawManifest = fs.readFileSync(manifestPath, { encoding: 'utf8' });
  const manifest = JSON.parse(rawManifest);

  return manifest;
};
