import LocalRemoveChat from 'api-server/chat/data/usecases/localRemoveChat';
import { RemoveChat } from 'api-server/chat/domain/usecases/removeChat';
import { makeChatRepository } from 'data/chat/factory';

const makeRemoveChat = async (): Promise<RemoveChat> => {
  return new LocalRemoveChat(await makeChatRepository());
};

export default makeRemoveChat;
