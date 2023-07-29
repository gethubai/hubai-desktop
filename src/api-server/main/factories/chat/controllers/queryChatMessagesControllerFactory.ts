import { QueryChatMessagesController } from 'api-server/presentation/chat/controllers/queryChatMessagesController';
import { Controller } from 'api-server/main/protocols/controller';
import { makeChatRepository } from 'data/chat/factory';
import makeLoadMessagesForRecipient from 'api-server/chat/factories/usecases/loadMessagesForRecipientFactory';

export const makeQueryChatMessagesController =
  async (): Promise<Controller> => {
    const controller = new QueryChatMessagesController(
      await makeChatRepository(),
      await makeLoadMessagesForRecipient()
    );
    return controller;
  };
