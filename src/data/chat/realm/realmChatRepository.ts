import Realm from 'realm';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import { IChatRepository } from '../chatRepository';
import { ChatDto } from './db';

export class RealmChatRepository implements IChatRepository {
  constructor(private readonly database: Realm) {}

  add = async (model: ChatModel): Promise<ChatModel> => {
    let createdModel: ChatModel | undefined;
    this.database.write(() => {
      createdModel = this.database.create(ChatDto, model).values;
    });

    if (!createdModel) throw new Error('Failed to add chat into the database');
    return createdModel;
  };

  update = (model: ChatModel): Promise<ChatModel> => {
    return new Promise<ChatModel>((resolve, reject) => {
      this.database.write(() => {
        const dto = this.getDto(model.id);

        if (!dto) {
          return reject(
            new Error(
              `Cannot update chat with id ${model.id} because it does not exist`
            )
          );
        }

        dto.brains = model.brains;
        dto.name = model.name;
        dto.messages = model.messages;
        resolve(dto.values);
        return dto;
      });
    });
  };

  getAll = async (): Promise<ChatModel[]> => {
    const models = this.database.objects(ChatDto);
    return models.map((item) => item.values);
  };

  get = async (id: string): Promise<ChatModel | undefined> => {
    const model = this.getDto(id);

    return model?.values;
  };

  getDto = (id: string): ChatDto | undefined => {
    const model = this.database.objectForPrimaryKey(ChatDto, id);
    return model;
  };
}
