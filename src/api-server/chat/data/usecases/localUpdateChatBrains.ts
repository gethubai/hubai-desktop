import { UpdateChatMembers } from 'api-server/chat/domain/usecases/updateChatBrains';
import { IChatRepository } from 'data/chat/chatRepository';

export default class LocalUpdateChatMembers implements UpdateChatMembers {
  constructor(private readonly repository: IChatRepository) {}

  async update(
    params: UpdateChatMembers.Params
  ): Promise<UpdateChatMembers.Model> {
    const { chatId, members } = params;
    const chat = await this.repository.get(chatId);

    if (!chat)
      throw new Error(`Cannot update chat members. Chat ${chatId} not found`);

    chat.members = members;
    return this.repository.update(chat);
  }
}
