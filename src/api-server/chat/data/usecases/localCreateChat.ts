import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { ChatDatabase } from 'data/chat/db';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';

export default class LocalCreateChat implements CreateChat {
  constructor(private readonly database: ChatDatabase) {}

  async create(params: CreateChat.Params): Promise<CreateChat.Model> {
    const { name, initiator, brains } = params;
    const chat = await this.database.chat.insert({
      id: generateUniqueId(),
      name,
      initiator,
      messages: [],
      createdDate: new Date().toISOString(),
      brains,
    });
    return chat._data as CreateChat.Model;
  }
}
