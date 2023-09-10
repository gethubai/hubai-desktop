import Realm from 'realm';
import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';
import {
  ILocalExtensionDto,
  ILocalExtensionRepository,
} from '../localExtensionRepository';
import { LocalExtensionDto } from './db';

export class RealmLocalExtensionRepository
  implements ILocalExtensionRepository
{
  constructor(private readonly database: Realm) {}

  update = (extension: LocalExtensionModel): Promise<ILocalExtensionDto> => {
    return new Promise<ILocalExtensionDto>((resolve, reject) => {
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
        dto.version = extension.version;
        dto.updatedDateUtc = extension.updatedDateUtc;
        dto.disabled = extension.disabled;

        resolve(dto.values);
        return dto;
      });
    });
  };

  add = async (extension: LocalExtensionModel): Promise<ILocalExtensionDto> => {
    let createdExtension: ILocalExtensionDto | undefined;
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

  remove = async (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      let dto = this.database.objectForPrimaryKey(LocalExtensionDto, id);

      if (!dto)
        reject(
          new Error(
            `Cannot remove extension with id ${id} because it does not exist`
          )
        );

      this.database.write(() => {
        this.database.delete(dto);
        dto = undefined;

        resolve();
      });
    });
  };

  getExtensions = async (): Promise<ILocalExtensionDto[]> => {
    const extensions = this.database.objects(LocalExtensionDto);
    return extensions.map((item) => item.values);
  };

  getExtension = async (
    id: string
  ): Promise<ILocalExtensionDto | undefined> => {
    const extension = this.database.objectForPrimaryKey(LocalExtensionDto, id);

    return extension?.values;
  };

  getExtensionByName = async (
    name: string
  ): Promise<ILocalExtensionDto | undefined> => {
    const extension = this.database
      .objects(LocalExtensionDto)
      .filtered(`name == $0`, name);

    if (extension.length > 0) return extension[0].values;

    return undefined;
  };
}
