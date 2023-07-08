import { LoadLocalExtensions } from 'api-server/extensions/domain/usecases/loadLocalExtensions';
import ElectronLoadLocalExtensions from '../../data/usecases/electronLoadLocalExtensions';

const makeLoadLocalExtensions = async (): Promise<LoadLocalExtensions> => {
  return new ElectronLoadLocalExtensions();
};

export default makeLoadLocalExtensions;
