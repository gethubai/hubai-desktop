import { LocalBrainModel } from '../domain/models/localBrain';

export type BrainInstallationResult = {
  success: boolean;
  error?: Error;
  result?: LocalBrainModel;
};

export type BrainUninstallationResult = {
  success: boolean;
  error?: Error;
};
