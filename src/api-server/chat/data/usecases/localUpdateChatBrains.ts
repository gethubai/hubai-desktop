import { UpdateChatBrains } from 'api-server/chat/domain/usecases/updateChatBrains';
import { ChatDatabase } from 'data/chat/db';

export default class LocalUpdateChatBrains implements UpdateChatBrains {
  constructor(private readonly database: ChatDatabase) {}

  async update(
    params: UpdateChatBrains.Params
  ): Promise<UpdateChatBrains.Model> {
    const { chatId, brains } = params;
    const chat = await this.database.chat.findOne(chatId).exec();

    const updated = await chat?.incrementalUpdate({
      $set: {
        brains,
      },
    });

    return updated._data as UpdateChatBrains.Model;
  }
}
