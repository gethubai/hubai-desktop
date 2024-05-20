import { IChatRepository } from 'data/chat/chatRepository';
import { ChatUser } from 'api-server/chat/domain/models/chat';
import chatServer from 'api-server/chat/chatTcpServer/server';
import { UpdateChat } from 'api-server/chat/domain/usecases/updateChat';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, ok } from '../../helpers';
import { IRequest } from '../../../main/protocols/requestContext';

export type AddChatMemberControllerRequest = IRequest & {
  chatId: string;
  member: ChatUser;
};

export class AddChatMemberController implements Controller {
  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly updateChat: UpdateChat
  ) {}

  handle = async (
    request: AddChatMemberControllerRequest
  ): Promise<HttpResponse> => {
    const chat = await this.chatRepository.get(request.chatId);
    if (!chat) return badRequest(new Error('Chat not found'));

    const currentMember = chat.members.find((m) => m.id === request.member.id);
    if (!currentMember) {
      chat.members.push(request.member);
    } else {
      // If member already exists, update it
      currentMember.handleMessageTypes = request.member.handleMessageTypes;
      currentMember.settings = request.member.settings;
    }

    this.updateChat.execute({
      id: chat.id,
      members: chat.members,
    });

    chatServer.notifyChatUpdated(chat);
    chatServer.notifyJoinedChat(chat, request.member.id);

    return ok(chat);
  };
}
