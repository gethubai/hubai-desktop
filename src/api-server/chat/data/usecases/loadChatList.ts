import { ChatModel } from 'api-server/chat/domain/models/chat';
import { LoadChatList } from 'api-server/chat/domain/usecases/loadChatList';
import { IChatRepository } from 'data/chat/chatRepository';

export default class LocalLoadChatList implements LoadChatList {
  constructor(private readonly repository: IChatRepository) {}

  loadChats = async (): Promise<ChatModel[]> => {
    const chats = await this.repository.getAll();
    return chats;
  };
}
