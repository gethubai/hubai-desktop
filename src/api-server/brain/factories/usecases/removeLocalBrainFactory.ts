import LocalRemoveLocalBrain from 'api-server/brain/data/usecases/localRemoveLocalBrain';
import { RemoveLocalBrain } from 'api-server/brain/domain/usecases/removeLocalBrain';
import { makeLocalBrainRepository } from 'data/brain/factory';

const makeRemoveLocalBrain = async (): Promise<RemoveLocalBrain> => {
  return new LocalRemoveLocalBrain(await makeLocalBrainRepository());
};

export default makeRemoveLocalBrain;
