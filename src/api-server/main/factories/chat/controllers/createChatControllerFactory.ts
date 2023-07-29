import { Controller } from 'api-server/main/protocols/controller';
import { CreateChatController } from 'api-server/presentation/chat/controllers';
import makeCreateChat from 'api-server/chat/factories/usecases/createChatFactory';

export const makeCreateChatController = async (): Promise<Controller> => {
  const controller = new CreateChatController(await makeCreateChat());
  return controller;
};
