import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { IChatRepository } from 'data/chat/chatRepository';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';

export default class LocalCreateChat implements CreateChat {
  constructor(private readonly repository: IChatRepository) {}

  async create(params: CreateChat.Params): Promise<CreateChat.Model> {
    const { name, initiator, members } = params;

    const isDirect = params.isDirect === undefined ? false : params.isDirect;

    if (
      isDirect &&
      members.filter((m) => m.memberType === 'brain').length !== 1
    ) {
      throw new Error('Direct chats can only have one brain');
    }

    const opt = {
      id: generateUniqueId(),
      name,
      initiator,
      messages: [],
      createdDate: new Date().toISOString(),
      members,
      isDirect,
    };

    return await this.repository.add(opt);
  }
}
