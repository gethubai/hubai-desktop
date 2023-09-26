import { UpdateChat } from 'api-server/chat/domain/usecases/updateChat';
import { IChatRepository } from 'data/chat/chatRepository';

export default class LocalUpdateChat implements UpdateChat {
  constructor(private readonly repository: IChatRepository) {}

  async execute(params: UpdateChat.Params): Promise<UpdateChat.Model> {
    const { id, members, name, lastActivity } = params;
    const chat = await this.repository.get(id);

    if (!chat) throw new Error(`Cannot update chat. Chat ${id} not found`);

    if (members !== undefined) chat.members = members;
    if (name !== undefined) chat.name = name;
    if (lastActivity !== undefined) chat.lastActivity = lastActivity;
    return this.repository.update(chat);
  }
}
