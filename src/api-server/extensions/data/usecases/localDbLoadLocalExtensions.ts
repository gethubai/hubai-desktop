import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';
import { LoadLocalExtensions } from 'api-server/extensions/domain/usecases/loadLocalExtensions';
import {
  ILocalExtensionDto,
  ILocalExtensionRepository,
} from 'data/extension/localExtensionRepository';
import { getExtensionManifest } from 'api-server/extensions/const';

export default class LocalDbLoadLocalExtensions implements LoadLocalExtensions {
  constructor(private readonly repository: ILocalExtensionRepository) {}

  getExtensions = async (): Promise<LocalExtensionModel[]> => {
    const extensions = await this.repository.getExtensions();

    const extensionsMap: LocalExtensionModel[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const extension of extensions) {
      if (extension.remoteUrl) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const data = await fetch(`${extension.remoteUrl}/manifest.json`);
          // eslint-disable-next-line no-await-in-loop
          const manifest = await data.json();

          if (manifest.name.toLowerCase() !== extension.name.toLowerCase()) {
            throw new Error(
              `Installed extension name doesn't match remote name. Installed: ${extension.name}, remote: ${manifest.name}`
            );
          }

          const remoteExtension = {
            ...this.mergeWithManifest(manifest, extension),
            main: `${extension.remoteUrl}/remoteEntry.js`,
            iconUrl: manifest.icon
              ? `${extension.remoteUrl}/${manifest.icon}`
              : undefined,
          };
          extensionsMap.push(remoteExtension);
        } catch (e) {
          console.error('Error while loading remote extension: ', e);
        }
      } else {
        const extensionDirectoryName = `${extension.name}-${extension.version}`;
        const manifest = getExtensionManifest(extension as any);

        extensionsMap.push({
          ...this.mergeWithManifest(manifest, extension),
          iconUrl: manifest.icon
            ? `plugins://${extensionDirectoryName}/${manifest.icon}`
            : undefined,
          main: `${extensionDirectoryName}/src/remoteEntry.js`,
        } as LocalExtensionModel);
      }
    }

    return extensionsMap;
  };

  mergeWithManifest = (manifest: any, extension: ILocalExtensionDto) => {
    return {
      ...extension,
      description: manifest.description,
      extensionKind: manifest.extensionKind,
      contributes: manifest.contributes,
      icon: manifest.icon,
      publisher: manifest.publisher,
      name: extension.name.toLowerCase(),
    } as LocalExtensionModel;
  };
}
