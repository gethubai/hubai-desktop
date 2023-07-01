import LocalDbAddLocalBrain from 'api-server/brain/data/usecases/localDbAddLocalBrain';
import { AddLocalBrain } from 'api-server/brain/domain/usecases/addLocalBrain';
import makeLocalBrainDatabase from '../makeLocalBrainDatabaseFactory';

const makeAddLocalBrain = async (): Promise<AddLocalBrain> => {
  return new LocalDbAddLocalBrain(await makeLocalBrainDatabase());
};

export default makeAddLocalBrain;
