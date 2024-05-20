import { IChatRepository } from 'data/chat/chatRepository';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { ok } from '../../helpers';

export type GetChatControllerRequest = {
  chatId: string;
};

export class GetChatController implements Controller {
  constructor(private readonly chatRepository: IChatRepository) {}

  handle = async (request: GetChatControllerRequest): Promise<HttpResponse> => {
    const chat = await this.chatRepository.get(request.chatId);
    return ok(chat);
  };
}
