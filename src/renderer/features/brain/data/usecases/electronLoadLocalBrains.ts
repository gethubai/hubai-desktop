import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { LoadLocalBrains } from 'api-server/brain/domain/usecases/loadLocalBrains';

export default class ElectronLoadLocalBrains implements LoadLocalBrains {
  getBrains = async (): Promise<LocalBrainModel[]> => {
    const brains = await window.electron.brain.getInstalledBrains();
    return brains;
  };
}
