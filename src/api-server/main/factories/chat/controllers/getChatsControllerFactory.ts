import { GetChatsController } from 'api-server/presentation/chat/controllers/getChatsController';
import { Controller } from 'api-server/main/protocols/controller';
import makeLoadChatList from 'api-server/chat/factories/usecases/loadChatListFactory';

export const makeGetChatsController = async (): Promise<Controller> => {
  return new GetChatsController(await makeLoadChatList());
};
