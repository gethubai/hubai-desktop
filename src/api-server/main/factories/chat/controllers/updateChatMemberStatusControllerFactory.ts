import { Controller } from 'api-server/main/protocols/controller';
import { UpdateChatMemberStatusController } from 'api-server/presentation/chat/controllers';
import { makeChatRepository } from 'data/chat/factory';

export const makeUpdateChatMemberStatusController =
  async (): Promise<Controller> => {
    return new UpdateChatMemberStatusController(await makeChatRepository());
  };
