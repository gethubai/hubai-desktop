import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';
import { LoadLocalExtensions } from 'api-server/extensions/domain/usecases/loadLocalExtensions';

export default class ElectronLoadLocalExtensions
  implements LoadLocalExtensions
{
  getExtensions = async (): Promise<LocalExtensionModel[]> => {
    const extensions = await window.electron.extension.getInstalledExtensions();
    return extensions;
  };
}
