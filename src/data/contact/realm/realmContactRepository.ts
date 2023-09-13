import Realm from 'realm';
import { IContactDto, IContactRepository } from '../contactRepository';
import { ContactDto } from './db';

export class RealmContactRepository implements IContactRepository {
  constructor(private readonly database: Realm) {}

  add = async (model: IContactDto): Promise<IContactDto> => {
    let createdModel: IContactDto | undefined;
    this.database.write(() => {
      createdModel = this.database.create(ContactDto, model).values;
    });

    if (!createdModel)
      throw new Error('Failed to create contact in local database');
    return createdModel;
  };

  update = (model: IContactDto): Promise<IContactDto> => {
    return new Promise<IContactDto>((resolve, reject) => {
      this.database.write(() => {
        const dto = this.database.objectForPrimaryKey(ContactDto, model.id);

        if (!dto) {
          return reject(
            new Error(
              `Cannot update contact with id ${model.id} because it does not exist`
            )
          );
        }

        dto.name = model.name;
        dto.avatar = model.avatar;
        dto.updatedDateUtc = model.updatedDateUtc;
        resolve(dto.values);
        return dto;
      });
    });
  };

  remove = async (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      let dto = this.database.objectForPrimaryKey(ContactDto, id);

      if (!dto)
        reject(
          new Error(
            `Cannot remove contact with id ${id} because it does not exist`
          )
        );

      this.database.write(() => {
        this.database.delete(dto);
        dto = undefined;

        resolve();
      });
    });
  };

  list = async (): Promise<IContactDto[]> => {
    const models = this.database.objects(ContactDto);
    return models.map((item) => item.values);
  };

  get = async (id: string): Promise<IContactDto | undefined> => {
    const model = this.database.objectForPrimaryKey(ContactDto, id);

    return model?.values;
  };
}
