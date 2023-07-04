// import LocalDbLoadLocalBrains from 'api-server/brain/data/usecases/localDbLoadLocalBrains';
import LocalDbLoadLocalBrains from 'api-server/brain/data/usecases/localDbLoadLocalBrains';
import { LoadLocalBrains } from 'api-server/brain/domain/usecases/loadLocalBrains';
import { makeLocalBrainRepository } from 'data/brain/factory';

const makeLoadLocalBrains = async (): Promise<LoadLocalBrains> => {
  return new LocalDbLoadLocalBrains(await makeLocalBrainRepository());
};

export default makeLoadLocalBrains;
