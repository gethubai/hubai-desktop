import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';
import { AddLocalExtension } from 'api-server/extensions/domain/usecases/addLocalExtension';
import { ILocalExtensionRepository } from 'data/extension/localExtensionRepository';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { getCurrentUtcDate } from 'utils/dateUtils';

export default class LocalDbAddLocalExtension implements AddLocalExtension {
  constructor(private readonly repository: ILocalExtensionRepository) {}

  add = async (
    extension: AddLocalExtension.Params
  ): Promise<LocalExtensionModel> => {
    // throw error if extension name contains any character other than letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(extension.name)) {
      throw new Error(
        'Extension name can only contain letters, numbers, and underscores'
      );
    }

    // throw error if extension name is empty
    if (extension.name.length === 0) {
      throw new Error('Extension name cannot be empty');
    }

    // throw error if extension name is too long
    if (extension.name.length > 50) {
      throw new Error('Extension name cannot be longer than 50 characters');
    }

    const extensionWithName = await this.repository.getExtensionByName(
      extension.name
    );

    const displayName = extension.displayName ?? extension.name;

    if (extensionWithName) {
      const extModel = {
        ...extensionWithName,
        name: extensionWithName.name.toLowerCase(),
        id: extensionWithName.id,
        displayName,
        description: extension.description,
        main: extension.main,
        version: extension.version,
        extensionKind: extension.extensionKind,
        contributes: extension.contributes,
        icon: extension.icon,
        iconUrl: extension.iconUrl,
        updatedDateUtc: getCurrentUtcDate(),
      } as LocalExtensionModel;
      // Update extension
      const result = await this.repository.update(extModel);
      return { ...extModel, ...result };
    }

    const extModel = {
      ...extension,
      id: generateUniqueId(),
      name: extension.name.toLowerCase(),
      displayName,
      installationDateUtc: getCurrentUtcDate(),
      disabled: false,
    };

    const result = await this.repository.add(extModel);
    return { ...extModel, ...result };
  };
}
