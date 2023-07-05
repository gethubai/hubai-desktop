import { SendMessage } from 'api-server/chat/domain/usecases/sendChatMessage';
import LocalSendChatTextMessage from 'api-server/chat/data/usecases/localSendMessage';
import { makeChatMessageRepository } from 'data/chat/factory';

const makeSendChatMessage = async (): Promise<SendMessage> => {
  return new LocalSendChatTextMessage(await makeChatMessageRepository());
};

export default makeSendChatMessage;
