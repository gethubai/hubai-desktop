import { RemoveLocalExtension } from 'api-server/extensions/domain/usecases/removeLocalExtension';
import LocalRemoveLocalExtension from 'api-server/extensions/data/usecases/localRemoveLocalExtension';
import { makeLocalExtensionRepository } from '../localExtensionRepositoryFactory';

const makeRemoveLocalExtension = async (): Promise<RemoveLocalExtension> => {
  return new LocalRemoveLocalExtension(await makeLocalExtensionRepository());
};

export default makeRemoveLocalExtension;
