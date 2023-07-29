import { IChatRepository } from 'data/chat/chatRepository';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { ok } from '../../helpers';

export class GetChatController implements Controller {
  constructor(private readonly chatRepository: IChatRepository) {}

  handle = async (
    request: GetChatController.Request
  ): Promise<HttpResponse> => {
    const chat = await this.chatRepository.get(request.chatId);
    return ok(chat);
  };
}

export namespace GetChatController {
  export type Request = {
    chatId: string;
  };
}
