import LocalCreateChat from 'api-server/chat/data/usecases/localCreateChat';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { makeChatRepository } from 'data/chat/factory';

const makeCreateChat = async (): Promise<CreateChat> => {
  return new LocalCreateChat(await makeChatRepository());
};

export default makeCreateChat;
