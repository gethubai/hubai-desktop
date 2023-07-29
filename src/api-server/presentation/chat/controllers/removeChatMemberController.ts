import { IChatRepository } from 'data/chat/chatRepository';
import { UpdateChatMembers } from 'api-server/chat/domain/usecases/updateChatBrains';
import chatServer from 'api-server/chat/chatTcpServer/server';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, ok } from '../../helpers';
import { IRequest } from '../../../main/protocols/requestContext';

export class RemoveChatMemberController implements Controller {
  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly updateChatMembers: UpdateChatMembers
  ) {}

  handle = async (
    request: RemoveChatMemberController.Request
  ): Promise<HttpResponse> => {
    const chat = await this.chatRepository.get(request.chatId);

    if (!chat) return badRequest(new Error('Chat not found'));

    chat.members = chat.members.filter((m) => m.id !== request.memberId);

    const updated = await this.updateChatMembers.update({
      chatId: chat.id,
      members: chat.members,
    });

    chatServer.notifyChatUpdated(updated);
    chatServer.notifyLeftChat(chat, request.memberId);

    return ok(updated);
  };
}

export namespace RemoveChatMemberController {
  export type Request = IRequest & {
    chatId: string;
    memberId: string;
  };
}
