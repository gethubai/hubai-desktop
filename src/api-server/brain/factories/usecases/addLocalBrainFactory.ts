import LocalDbAddLocalBrain from 'api-server/brain/data/usecases/localDbAddLocalBrain';
import { AddLocalBrain } from 'api-server/brain/domain/usecases/addLocalBrain';
import makeAddOrUpdateContact from 'api-server/contact/factories/usecases/addOrUpdateContactFactory';
import { makeLocalBrainRepository } from 'data/brain/factory';

const makeAddLocalBrain = async (): Promise<AddLocalBrain> => {
  return new LocalDbAddLocalBrain(
    await makeLocalBrainRepository(),
    await makeAddOrUpdateContact()
  );
};

export default makeAddLocalBrain;
