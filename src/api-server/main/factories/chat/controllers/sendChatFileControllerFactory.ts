import { Controller } from 'api-server/main/protocols/controller';
import { SendChatFileController } from 'api-server/presentation/chat/controllers';
import makeSaveFileChat from 'api-server/chat/factories/usecases/saveFileChatFactory';

export const makeSendChatFileController = async (): Promise<Controller> => {
  return new SendChatFileController(await makeSaveFileChat());
};
