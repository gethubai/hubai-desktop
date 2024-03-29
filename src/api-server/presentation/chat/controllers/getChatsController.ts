import { LoadChatList } from 'api-server/chat/domain/usecases/loadChatList';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { ok, unauthorized } from '../../helpers';
import { IRequest } from '../../../main/protocols/requestContext';

export class GetChatsController implements Controller {
  constructor(private readonly chatList: LoadChatList) {}

  handle = async (
    request: GetChatsController.Request
  ): Promise<HttpResponse> => {
    if (!request.context.userId) return unauthorized();

    const userIds = [request.context.userId];

    if (request.userId) {
      if (Array.isArray(request.userId)) {
        userIds.push(...request.userId);
      } else {
        userIds.push(request.userId);
      }
    }

    const chats = await this.chatList.loadChats({
      userId: userIds,
      isDirect: request.isDirect,
    });
    return ok(chats);
  };
}

export namespace GetChatsController {
  export type Request = IRequest & {
    userId?: string | string[];
    isDirect?: boolean;
  };
}
