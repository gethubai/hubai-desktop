import { Controller } from 'api-server/main/protocols/controller';
import { makeChatRepository } from 'data/chat/factory';
import { RemoveChatMemberController } from 'api-server/presentation/chat/controllers';
import makeUpdateChat from 'api-server/chat/factories/usecases/updateChatFactory';

export const makeRemoveChatMemberController = async (): Promise<Controller> => {
  return new RemoveChatMemberController(
    await makeChatRepository(),
    await makeUpdateChat()
  );
};
