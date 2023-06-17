import LocalCreateChat from 'api-server/chat/data/usecases/localCreateChat';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import makeChatDatabase from '../databaseFactory';

const makeCreateChat = async (): Promise<CreateChat> => {
  const db = await makeChatDatabase();
  return new LocalCreateChat(db);
};

export default makeCreateChat;
