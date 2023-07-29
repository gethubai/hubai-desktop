import makeUpdateChatMembers from 'api-server/chat/factories/usecases/updateChatBrainsFactory';
import { Controller } from 'api-server/main/protocols/controller';
import { AddChatMemberController } from 'api-server/presentation/chat/controllers';
import { makeChatRepository } from 'data/chat/factory';

export const makeAddChatMemberController = async (): Promise<Controller> => {
  const controller = new AddChatMemberController(
    await makeChatRepository(),
    await makeUpdateChatMembers()
  );
  return controller;
};
