import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { IChatRepository } from 'data/chat/chatRepository';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';

export default class LocalCreateChat implements CreateChat {
  constructor(private readonly repository: IChatRepository) {}

  async create(params: CreateChat.Params): Promise<CreateChat.Model> {
    const { name, initiator, brains } = params;
    const chat = await this.repository.add({
      id: generateUniqueId(),
      name,
      initiator,
      messages: [],
      createdDate: new Date().toISOString(),
      brains,
    });
    return chat;
  }
}
