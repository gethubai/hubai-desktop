import { RemoveChat } from 'api-server/chat/domain/usecases/removeChat';
import { IRequest } from 'api-server/main/protocols/requestContext';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, ok } from '../../helpers';

export type RemoveChatControllerRequest = IRequest & {
  chatId: string;
};

export class RemoveChatController implements Controller {
  constructor(private readonly removeChat: RemoveChat) {}

  handle = async (
    request: RemoveChatControllerRequest
  ): Promise<HttpResponse> => {
    // TODO: Check if the user has permission
    const result = await this.removeChat.execute({
      id: request.chatId,
    });

    if (result.success) return ok(result);

    return badRequest(new Error(result.error));
  };
}
