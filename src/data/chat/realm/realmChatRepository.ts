import Realm from 'realm';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import app from 'data/realm/app';
import { ChatListFilters, IChatRepository } from '../chatRepository';
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
        dto.lastActivity = model.lastActivity;
        return resolve(dto.values);
      });
    });
  };

  list = async (filters?: ChatListFilters): Promise<ChatModel[]> => {
    let models = this.database.objects(ChatDto);

    if (filters?.userId) {
      if (Array.isArray(filters.userId)) {
        models = models.filtered(
          `ALL {${filters.userId
            .map((_, i) => `$${i}`)
            .join(', ')}} IN ANY members.id`,
          ...filters.userId
        );
      } else {
        models = models.filtered(`members.id == $0`, filters.userId);
      }
    }

    if (filters?.isDirect !== undefined) {
      models = models.filtered(`isDirect == $0`, filters.isDirect);
    }

    return models.map((item) => item.values);
  };

  remove = async (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      let dto = this.database.objectForPrimaryKey(ChatDto, id);

      if (!dto)
        reject(
          new Error(
            `Cannot remove chat with id ${id} because it does not exist`
          )
        );

      this.database.write(() => {
        this.database.delete(dto);
        dto = undefined;

        resolve();
      });
    });
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
