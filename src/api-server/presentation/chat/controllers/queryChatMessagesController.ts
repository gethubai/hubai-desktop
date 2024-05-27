/* eslint-disable no-restricted-syntax */
import { IChatRepository } from 'data/chat/chatRepository';
import { IRequest } from 'api-server/main/protocols/requestContext';
import { LoadMessageForRecipient } from 'api-server/chat/domain/usecases/loadMessagesForRecipient';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, noContent, ok } from '../../helpers';

export type QueryChatMessagesControllerRequest = IRequest & {
  chatId: string;
};

export class QueryChatMessagesController implements Controller {
  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly loadMessagesForRecipient: LoadMessageForRecipient
  ) {}

  handle = async (
    request: QueryChatMessagesControllerRequest
  ): Promise<HttpResponse> => {
    const chat = await this.chatRepository.get(request.chatId);
    if (!chat) return badRequest(new Error('Chat not found'));

    const chatMessages = await this.loadMessagesForRecipient.loadMessages({
      chatId: chat.id,
      recipientId: request.context.userId,
    });

    if (chatMessages && chatMessages.length > 0) return ok(chatMessages[0]);

    return noContent();
  };
}
