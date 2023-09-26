import { Controller } from 'api-server/main/protocols/controller';
import { makeChatRepository } from 'data/chat/factory';
import { SendMessageController } from 'api-server/presentation/chat/controllers';
import makeSendChatMessage from 'api-server/chat/factories/usecases/sendChatTextMessageFactory';
import makeUpdateChat from 'api-server/chat/factories/usecases/updateChatFactory';

export const makeSendMessageController = async (): Promise<Controller> => {
  return new SendMessageController(
    await makeChatRepository(),
    await makeSendChatMessage(),
    await makeUpdateChat()
  );
};
