import { LoadLocalBrains } from 'api-server/brain/domain/usecases/loadLocalBrains';
import ElectronLoadLocalBrains from '../../data/usecases/electronLoadLocalBrains';

const makeLoadLocalBrains = async (): Promise<LoadLocalBrains> => {
  return new ElectronLoadLocalBrains();
};

export default makeLoadLocalBrains;
