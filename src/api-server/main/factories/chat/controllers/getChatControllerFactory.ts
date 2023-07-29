import { Controller } from 'api-server/main/protocols/controller';
import { makeChatRepository } from 'data/chat/factory';
import { GetChatController } from 'api-server/presentation/chat/controllers';

export const makeGetChatController = async (): Promise<Controller> => {
  return new GetChatController(await makeChatRepository());
};
