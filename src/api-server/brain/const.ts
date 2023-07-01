import { getBrainsStoragePath } from 'utils/pathUtils';
import path from 'path';
import { LocalBrainModel } from './domain/models/localBrain';

export const getBrainPath = (brain: LocalBrainModel) => {
  return getBrainsStoragePath(`${brain.name}-${brain.version}`);
};

export const getBrainMainPath = (brain: LocalBrainModel) => {
  const installationPath = getBrainPath(brain);
  return path.join(installationPath, brain.main);
};
