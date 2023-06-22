import MockLoadLocalBrains from 'api-server/brain/data/usecases/mockLoadLocalBrains';
import { LoadLocalBrains } from 'api-server/brain/domain/usecases/loadLocalBrains';

const makeLoadLocalBrains = async (): Promise<LoadLocalBrains> => {
  return new MockLoadLocalBrains();
};

export default makeLoadLocalBrains;
