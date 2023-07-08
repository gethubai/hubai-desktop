import { LoadLocalExtensions } from 'api-server/extensions/domain/usecases/loadLocalExtensions';
import LocalDbLoadLocalExtensions from 'api-server/extensions/data/usecases/localDbLoadLocalExtensions';
import { makeLocalExtensionRepository } from '../localExtensionRepositoryFactory';

const makeLoadLocalExtensions = async (): Promise<LoadLocalExtensions> => {
  return new LocalDbLoadLocalExtensions(await makeLocalExtensionRepository());
};

export default makeLoadLocalExtensions;
