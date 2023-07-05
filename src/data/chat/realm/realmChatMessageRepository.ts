import Realm from 'realm';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import {
  ChatMessageFilter,
  IChatMessageRepository,
} from '../chatMessageRepository';
import {
  ChatDto,
  ChatImageMessageDto,
  ChatMessageDto,
  ChatTextMessageDto,
  ChatVoiceMessageDto,
} from './db';

export class RealmChatMessageRepository implements IChatMessageRepository {
  constructor(private readonly database: Realm) {}

  add = async (model: ChatMessageModel): Promise<ChatMessageModel> => {
    let createdModel: ChatMessageModel | undefined;

    const chat = this.database.objectForPrimaryKey(ChatDto, model.chat);

    if (!chat)
      throw new Error(
        `Cannot add message because chat ${model.chat} does not exist`
      );

    this.database.write(() => {
      const newMessage = this.database.create(ChatMessageDto, {
        ...model,
        chatId: model.chat,
      });

      if (!chat.messages) chat.messages = [newMessage as any];
      else chat.messages.push(newMessage as any);
      createdModel = newMessage.values;
    });

    if (!createdModel)
      throw new Error('Failed to add message into the database');
    return createdModel;
  };

  update = (model: ChatMessageModel): Promise<ChatMessageModel> => {
    return new Promise<ChatMessageModel>((resolve, reject) => {
      this.database.write(() => {
        const dto = this.getDto(model.id);

        if (!dto) {
          return reject(
            new Error(
              `Cannot update message with id ${model.id} because it does not exist`
            )
          );
        }

        dto.text = model.text as ChatTextMessageDto;
        dto.image = model.image as ChatImageMessageDto;
        dto.voice = model.voice as ChatVoiceMessageDto;
        dto.status = model.status;
        resolve(dto.values);
        return dto;
      });
    });
  };

  get = async (id: string): Promise<ChatMessageModel | undefined> => {
    const model = this.getDto(id);

    return model?.values;
  };

  getAll = async (filter?: ChatMessageFilter): Promise<ChatMessageModel[]> => {
    let models = this.database.objects(ChatMessageDto);
    if (filter?.to) {
      models = models.filtered(`to == $0`, filter.to);
    }
    if (filter?.status) {
      models = models.filtered(`status == $0`, filter.status);
    }

    if (filter?.ids) models = models.filtered(`id IN $0`, filter.ids);

    return models.map((item) => item.values);
  };

  getDto = (id: string): ChatMessageDto | undefined => {
    return this.database.objectForPrimaryKey(ChatMessageDto, id);
  };
}
