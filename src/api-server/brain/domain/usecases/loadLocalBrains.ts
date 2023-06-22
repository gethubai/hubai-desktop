import { LocalBrainModel } from '../models/localBrain';

export interface LoadLocalBrains {
  getBrains: () => Promise<LoadLocalBrains.Model[]>;
}

export namespace LoadLocalBrains {
  export type Model = LocalBrainModel;
}
