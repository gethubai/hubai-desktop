import { AddLocalExtension } from 'api-server/extensions/domain/usecases/addLocalExtension';
import LocalDbAddLocalExtension from 'api-server/extensions/data/usecases/localDbAddLocalExtension';
import { makeLocalExtensionRepository } from '../localExtensionRepositoryFactory';

const makeAddLocalExtension = async (): Promise<AddLocalExtension> => {
  return new LocalDbAddLocalExtension(await makeLocalExtensionRepository());
};

export default makeAddLocalExtension;
