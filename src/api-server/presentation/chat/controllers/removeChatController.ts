import { RemoveChat } from 'api-server/chat/domain/usecases/removeChat';
import { IRequest } from 'api-server/main/protocols/requestContext';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, ok } from '../../helpers';

export class RemoveChatController implements Controller {
  constructor(private readonly removeChat: RemoveChat) {}

  handle = async (
    request: RemoveChatController.Request
  ): Promise<HttpResponse> => {
    // TODO: Check if the user has permission
    const result = await this.removeChat.execute({
      id: request.chatId,
    });

    if (result.success) return ok(result);

    return badRequest(new Error(result.error));
  };
}

export namespace RemoveChatController {
  export type Request = IRequest & {
    chatId: string;
  };
}
