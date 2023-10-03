import { ChatModel } from 'api-server/chat/domain/models/chat';
import { LoadChatList } from 'api-server/chat/domain/usecases/loadChatList';
import { IChatRepository } from 'data/chat/chatRepository';

export default class LocalLoadChatList implements LoadChatList {
  constructor(private readonly repository: IChatRepository) {}

  loadChats = async (params: LoadChatList.Params): Promise<ChatModel[]> => {
    let userId = params?.userId;

    // Use single userId if it is an array with only one element
    // This is to avoid Realm's ANY operator and improve query performance
    if (Array.isArray(userId) && userId.length === 1) {
      [userId] = userId;
    }

    if (typeof params.isDirect === 'string')
      params.isDirect = params.isDirect === 'true';

    return this.repository.list({ ...params, userId });
  };
}
