import LocalLoadChatList from 'api-server/chat/data/usecases/loadChatList';
import { LoadChatList } from 'api-server/chat/domain/usecases/loadChatList';
import { makeChatRepository } from 'data/chat/factory';

const makeLoadChatList = async (): Promise<LoadChatList> => {
  return new LocalLoadChatList(await makeChatRepository());
};

export default makeLoadChatList;
