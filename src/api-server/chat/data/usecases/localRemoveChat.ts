import { RemoveChat } from 'api-server/chat/domain/usecases/removeChat';
import { IChatRepository } from 'data/chat/chatRepository';

export default class LocalRemoveChat implements RemoveChat {
  constructor(private readonly repository: IChatRepository) {}

  async execute(params: RemoveChat.Params): Promise<RemoveChat.Model> {
    const { id } = params;

    return this.repository
      .remove(id)
      .then(() => ({ success: true }))
      .catch((error) => ({ success: false, error: error.message }));
  }
}
