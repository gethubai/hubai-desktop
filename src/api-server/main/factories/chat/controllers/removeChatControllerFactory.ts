import { Controller } from 'api-server/main/protocols/controller';
import { RemoveChatController } from 'api-server/presentation/chat/controllers';
import makeRemoveChat from 'api-server/chat/factories/usecases/removeChatFactory';

export const makeRemoveChatController = async (): Promise<Controller> => {
  return new RemoveChatController(await makeRemoveChat());
};
