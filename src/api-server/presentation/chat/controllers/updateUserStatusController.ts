import chatServer from 'api-server/chat/chatTcpServer/server';
import { IRequest } from 'api-server/main/protocols/requestContext';
import { IChatRepository } from 'data/chat/chatRepository';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, ok } from '../../helpers';

export class UpdateChatMemberStatusController implements Controller {
  constructor(private readonly chatRepository: IChatRepository) {}

  handle = async (
    request: UpdateChatMemberStatusController.Request
  ): Promise<HttpResponse> => {
    const chat = await this.chatRepository.get(request.chatId);
    const { userId } = request.context;
    if (!chat) return ok('');

    if (chat.members.findIndex((m) => m.id === userId) === -1)
      return badRequest(new Error('User is not on the chat'));

    chatServer.notifyUserStatusUpdated(chat, userId, {
      isTyping: request.isTyping,
    });

    return ok('');
  };
}

export namespace UpdateChatMemberStatusController {
  export type Request = IRequest & {
    chatId: string;
    isTyping?: boolean;
  };
}
