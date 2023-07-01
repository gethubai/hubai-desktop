// import LocalDbLoadLocalBrains from 'api-server/brain/data/usecases/localDbLoadLocalBrains';
import LocalDbLoadLocalBrains from 'api-server/brain/data/usecases/localDbLoadLocalBrains';
import { LoadLocalBrains } from 'api-server/brain/domain/usecases/loadLocalBrains';
import makeLocalBrainDatabase from '../makeLocalBrainDatabaseFactory';

const makeLoadLocalBrains = async (): Promise<LoadLocalBrains> => {
  return new LocalDbLoadLocalBrains(await makeLocalBrainDatabase());
};

export default makeLoadLocalBrains;
