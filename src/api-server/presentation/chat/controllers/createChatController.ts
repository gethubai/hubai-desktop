import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { ChatUser } from 'api-server/chat/domain/models/chat';
import chatServer from 'api-server/chat/chatTcpServer/server';
import { IRequest } from 'api-server/main/protocols/requestContext';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { ok } from '../../helpers';

export class CreateChatController implements Controller {
  constructor(private readonly createChat: CreateChat) {}

  handle = async (
    request: CreateChatController.Request
  ): Promise<HttpResponse> => {
    // TODO: Check if the user has permission?
    const chat = await this.createChat.create({
      name: request.name,
      members: request.members as ChatUser[],
      initiator: request.context.userId,
    });

    // I'm not sure if this should be here or not... maybe it should be in the usecase?
    chatServer.notifyChatCreated(chat);
    return ok(chat);
  };
}

export namespace CreateChatController {
  export type Request = IRequest & {
    name: string;
    members: {
      id: string;
      memberType: string;
      handleMessageTypes?: string[];
    }[];
  };
}
