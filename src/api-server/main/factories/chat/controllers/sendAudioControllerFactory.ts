import { Controller } from 'api-server/main/protocols/controller';
import { SendAudioController } from 'api-server/presentation/chat/controllers';
import makeSaveAudioChat from 'api-server/chat/factories/usecases/saveAudioChatFactory';

export const makeSendAudioController = async (): Promise<Controller> => {
  return new SendAudioController(await makeSaveAudioChat());
};
