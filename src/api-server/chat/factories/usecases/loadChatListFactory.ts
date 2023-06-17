import LocalLoadChatList from 'api-server/chat/data/usecases/loadChatList';
import { LoadChatList } from 'api-server/chat/domain/usecases/loadChatList';
import makeChatDatabase from '../databaseFactory';

const makeLoadChatList = async (): Promise<LoadChatList> => {
  return new LocalLoadChatList(await makeChatDatabase());
};

export default makeLoadChatList;
