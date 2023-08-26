import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';
import { LoadLocalExtensions } from 'api-server/extensions/domain/usecases/loadLocalExtensions';
import { ILocalExtensionRepository } from 'data/extension/localExtensionRepository';

export default class LocalDbLoadLocalExtensions implements LoadLocalExtensions {
  constructor(private readonly repository: ILocalExtensionRepository) {}

  getExtensions = async (): Promise<LocalExtensionModel[]> => {
    const extensions = await this.repository.getExtensions();
    // TODO: Should we use the original main path?
    return extensions.map((extension) => ({
      ...extension,
      main: `${extension.name}-${extension.version}/src/remoteEntry.js`,
    }));
  };
}
