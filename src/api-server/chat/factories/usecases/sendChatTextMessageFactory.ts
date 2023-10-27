import { SendMessage } from 'api-server/chat/domain/usecases/sendChatMessage';
import LocalSendChatTextMessage from 'api-server/chat/data/usecases/localSendMessage';
import { makeChatMessageRepository } from 'data/chat/factory';
import makeSaveFileChat from './saveFileChatFactory';

const makeSendChatMessage = async (): Promise<SendMessage> => {
  return new LocalSendChatTextMessage(
    await makeChatMessageRepository(),
    await makeSaveFileChat()
  );
};

export default makeSendChatMessage;
