import { ChatModel } from 'api-server/chat/domain/models/chat';
import { LoadChatList } from 'api-server/chat/domain/usecases/loadChatList';
import { ChatDatabase } from 'data/chat/db';

export default class LocalLoadChatList implements LoadChatList {
  constructor(private readonly database: ChatDatabase) {}

  loadChats = async (): Promise<ChatModel[]> => {
    const chats = await this.database.chat.find().exec();
    return chats as ChatModel[];
  };
}
