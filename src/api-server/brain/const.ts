import path from 'path';
import fs from 'fs';

import { getBrainsStoragePath } from 'utils/pathUtils';
import { LocalBrainModel } from './domain/models/localBrain';

export const getBrainPath = (brain: LocalBrainModel) => {
  return getBrainsStoragePath(`${brain.name}-${brain.version}`);
};

export const getBrainMainPath = (brain: LocalBrainModel) => {
  const installationPath = getBrainPath(brain);
  return path.join(installationPath, brain.main);
};

export const getBrainManifest = (brain: LocalBrainModel) => {
  const manifestPath = path.join(getBrainPath(brain), 'manifest.json');

  const rawManifest = fs.readFileSync(manifestPath, { encoding: 'utf8' });
  const manifest = JSON.parse(rawManifest);

  return manifest;
};

export const getBrainAvatarUrl = (
  brain: LocalBrainModel
): string | undefined => {
  const manifest = getBrainManifest(brain);

  if (manifest.icon) {
    return `plugins://${brain.name}-${brain.version}/${manifest.icon}`;
  }

  return undefined;
};
