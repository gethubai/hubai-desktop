import { IChatRepository } from 'data/chat/chatRepository';
import chatServer from 'api-server/chat/chatTcpServer/server';
import { UpdateChat } from 'api-server/chat/domain/usecases/updateChat';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, ok } from '../../helpers';
import { IRequest } from '../../../main/protocols/requestContext';

export type RemoveChatMemberControllerRequest = IRequest & {
  chatId: string;
  memberId: string;
};

export class RemoveChatMemberController implements Controller {
  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly updateChat: UpdateChat
  ) {}

  handle = async (
    request: RemoveChatMemberControllerRequest
  ): Promise<HttpResponse> => {
    const chat = await this.chatRepository.get(request.chatId);

    if (!chat) return badRequest(new Error('Chat not found'));

    chat.members = chat.members.filter((m) => m.id !== request.memberId);

    const updated = await this.updateChat.execute({
      id: chat.id,
      members: chat.members,
    });

    chatServer.notifyChatUpdated(updated);
    chatServer.notifyLeftChat(chat, request.memberId);

    return ok(updated);
  };
}
