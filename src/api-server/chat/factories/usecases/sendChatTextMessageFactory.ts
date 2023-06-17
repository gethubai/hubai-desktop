import { SendMessage } from 'api-server/chat/domain/usecases/sendChatMessage';
import LocalSendChatTextMessage from 'api-server/chat/data/usecases/localSendMessage';
import makeChatDatabase from '../databaseFactory';

const makeSendChatMessage = async (): Promise<SendMessage> => {
  return new LocalSendChatTextMessage(await makeChatDatabase());
};

export default makeSendChatMessage;
