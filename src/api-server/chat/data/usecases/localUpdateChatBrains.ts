import { UpdateChatBrains } from 'api-server/chat/domain/usecases/updateChatBrains';
import { IChatRepository } from 'data/chat/chatRepository';

export default class LocalUpdateChatBrains implements UpdateChatBrains {
  constructor(private readonly repository: IChatRepository) {}

  async update(
    params: UpdateChatBrains.Params
  ): Promise<UpdateChatBrains.Model> {
    const { chatId, brains } = params;
    const chat = await this.repository.get(chatId);

    if (!chat)
      throw new Error(`Cannot update chat brains. Chat ${chatId} not found`);

    chat.brains = brains;
    return this.repository.update(chat);
  }
}
