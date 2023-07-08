import Realm from 'realm';
import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';
import { ILocalExtensionRepository } from '../localExtensionRepository';
import { LocalExtensionDto } from './db';

export class RealmLocalExtensionRepository
  implements ILocalExtensionRepository
{
  constructor(private readonly database: Realm) {}

  update = (extension: LocalExtensionModel): Promise<LocalExtensionModel> => {
    return new Promise<LocalExtensionModel>((resolve, reject) => {
      this.database.write(() => {
        const dto = this.database.objectForPrimaryKey(
          LocalExtensionDto,
          extension.id
        );

        if (!dto) {
          return reject(
            new Error(
              `Cannot update extension with id ${extension.id} because it does not exist`
            )
          );
        }

        dto.displayName = extension.displayName;
        dto.description = extension.description;
        dto.main = extension.main;
        dto.version = extension.version;
        dto.extensionKind = extension.extensionKind;
        dto.contributes = extension.contributes;
        dto.icon = extension.icon;
        dto.updatedDateUtc = extension.updatedDateUtc;
        dto.disable = extension.disable;

        resolve(dto.values);
        return dto;
      });
    });
  };

  add = async (
    extension: LocalExtensionModel
  ): Promise<LocalExtensionModel> => {
    let createdExtension: LocalExtensionModel | undefined;
    this.database.write(() => {
      createdExtension = this.database.create(
        LocalExtensionDto,
        extension
      ).values;
    });

    if (!createdExtension)
      throw new Error('Failed to create extension in local database');
    return createdExtension;
  };

  getExtensions = async (): Promise<LocalExtensionModel[]> => {
    const extensions = this.database.objects(LocalExtensionDto);
    return extensions.map((item) => item.values);
  };

  getExtension = async (
    id: string
  ): Promise<LocalExtensionModel | undefined> => {
    const extension = this.database.objectForPrimaryKey(LocalExtensionDto, id);

    return extension?.values;
  };

  getExtensionByName = async (
    name: string
  ): Promise<LocalExtensionModel | undefined> => {
    const extension = this.database
      .objects(LocalExtensionDto)
      .filtered(`name == $0`, name);

    if (extension.length > 0) return extension[0].values as LocalExtensionModel;

    return undefined;
  };
}
