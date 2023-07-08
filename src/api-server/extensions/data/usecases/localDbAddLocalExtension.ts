import { IContribute } from '@hubai/core';
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

    const contributes = this.sanitizeContributes(extension.contributes);

    if (extensionWithName) {
      // Update extension
      const result = await this.repository.update({
        ...extensionWithName,
        id: extensionWithName.id,
        displayName,
        description: extension.description,
        main: extension.main,
        version: extension.version,
        extensionKind: extension.extensionKind,
        contributes,
        icon: extension.icon,
        updatedDateUtc: getCurrentUtcDate(),
      });
      return result;
    }

    const result = await this.repository.add({
      ...extension,
      id: generateUniqueId(),
      displayName,
      installationDateUtc: getCurrentUtcDate(),
      disable: false,
      contributes,
    });
    return result;
  };

  sanitizeContributes = (
    contributes?: IContribute
  ): IContribute | undefined => {
    if (contributes?.themes?.length) {
      // We don't wanna save the whole theme object in the database, just the most important parts
      // We will retrieve the full theme object when the extension is loaded
      contributes.themes = contributes.themes.map((theme) => ({
        id: theme.id,
        label: theme.label,
        uiTheme: theme.uiTheme,
        description: theme.description,
        type: theme.type,
        semanticHighlighting: theme.semanticHighlighting,
      }));
    }

    return contributes;
  };
}
