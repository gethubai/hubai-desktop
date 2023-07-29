import Realm from 'realm';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import app from 'data/realm/app';
import { IChatRepository } from '../chatRepository';
import { ChatDto } from './db';

export class RealmChatRepository implements IChatRepository {
  constructor(private readonly database: Realm) {}

  add = async (model: ChatModel): Promise<ChatModel> => {
    let createdModel: ChatModel | undefined;
    this.database.write(() => {
      createdModel = this.database.create(ChatDto, {
        ...model,
        _id: model.id,
        owner_id: app.currentUser?.id,
      }).values;
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
        dto.name = model.name;
        dto.members = model.members;
        resolve(dto.values);
      });
    });
  };

  list = async (userId?: string): Promise<ChatModel[]> => {
    let models = this.database.objects(ChatDto);

    if (userId) models = models.filtered(`members.id == $0`, userId);

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
