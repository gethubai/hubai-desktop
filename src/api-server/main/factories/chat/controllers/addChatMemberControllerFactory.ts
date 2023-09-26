import makeUpdateChat from 'api-server/chat/factories/usecases/updateChatFactory';
import { Controller } from 'api-server/main/protocols/controller';
import { AddChatMemberController } from 'api-server/presentation/chat/controllers';
import { makeChatRepository } from 'data/chat/factory';

export const makeAddChatMemberController = async (): Promise<Controller> => {
  const controller = new AddChatMemberController(
    await makeChatRepository(),
    await makeUpdateChat()
  );
  return controller;
};
