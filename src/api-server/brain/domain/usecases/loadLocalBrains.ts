import { LocalBrainModel } from '../models/localBrain';

export type LoadLocalBrainsModel = LocalBrainModel;

export interface LoadLocalBrains {
  getBrains: () => Promise<LoadLocalBrainsModel[]>;
}
