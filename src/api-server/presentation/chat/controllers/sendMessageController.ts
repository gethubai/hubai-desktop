import { IChatRepository } from 'data/chat/chatRepository';
import {
  ImageMessage,
  TextMessage,
  VoiceMessage,
  ChatMessageType,
  ChatMessageStatus,
  IRecipientSettings,
} from 'api-server/chat/domain/models/chatMessage';
import { SendMessage } from 'api-server/chat/domain/usecases/sendChatMessage';
import chatServer from 'api-server/chat/chatTcpServer/server';
import { IRequest } from 'api-server/main/protocols/requestContext';
import { getMembersIdsForMessageType } from 'api-server/chat/chatUtils';
import { ChatMemberType } from 'api-server/chat/domain/models/chat';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, ok } from '../../helpers';

export class SendMessageController implements Controller {
  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly sendChatMessage: SendMessage
  ) {}

  handle = async (
    request: SendMessageController.Request
  ): Promise<HttpResponse> => {
    const chat = await this.chatRepository.get(request.chatId);
    const senderId = request.context.userId;

    if (!chat) return badRequest(new Error('Chat not found'));

    if (chat.members.every((m) => m.id !== senderId))
      return badRequest(new Error('User is not a member of this chat'));

    let messageType: ChatMessageType = 'text';
    if (request.image) messageType = 'image';
    if (request.voice) messageType = 'voice';

    const recipients = getMembersIdsForMessageType(
      chat,
      messageType,
      ChatMemberType.brain
    );

    const addedMessage = await this.sendChatMessage.send({
      chatId: request.chatId,
      senderId,
      text: request.text,
      image: request.image,
      voice: request.voice,
      hidden: request.hidden,
      messageType,
      status: ChatMessageStatus.SENT,
      recipients: recipients || [],
    });

    chatServer.notifyMessageReceived(addedMessage);

    return ok({ id: addedMessage.id });
  };
}

export namespace SendMessageController {
  export type Request = IRequest & {
    chatId: string;
    text?: TextMessage;
    image?: ImageMessage;
    voice?: VoiceMessage;
    recipientSettings: IRecipientSettings;
    hidden?: boolean;
  };
}
