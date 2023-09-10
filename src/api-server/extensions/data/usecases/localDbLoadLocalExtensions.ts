import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';
import { LoadLocalExtensions } from 'api-server/extensions/domain/usecases/loadLocalExtensions';
import { ILocalExtensionRepository } from 'data/extension/localExtensionRepository';
import { getExtensionManifest } from 'api-server/extensions/const';

export default class LocalDbLoadLocalExtensions implements LoadLocalExtensions {
  constructor(private readonly repository: ILocalExtensionRepository) {}

  getExtensions = async (): Promise<LocalExtensionModel[]> => {
    const extensions = await this.repository.getExtensions();

    // TODO: Should we use the original main path?
    const extensionsMap = extensions.map((extension) => {
      const extensionDirectoryName = `${extension.name}-${extension.version}`;
      const manifest = getExtensionManifest(extension as any);

      return {
        ...extension,
        description: manifest.description,
        extensionKind: manifest.extensionKind,
        contributes: manifest.contributes,
        icon: manifest.icon,
        iconUrl: manifest.icon
          ? `plugins://${extensionDirectoryName}/${manifest.icon}`
          : undefined,
        publisher: manifest.publisher,
        main: `${extensionDirectoryName}/src/remoteEntry.js`,
        name: extension.name.toLowerCase(),
      } as LocalExtensionModel;
    });

    return extensionsMap;
  };
}
