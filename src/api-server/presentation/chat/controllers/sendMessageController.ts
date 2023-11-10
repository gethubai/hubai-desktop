import { IChatRepository } from 'data/chat/chatRepository';
import {
  ImageMessage,
  TextMessage,
  VoiceMessage,
  ChatMessageType,
  ChatMessageStatus,
  IRecipientSettings,
  ChatMessageModel,
  RawMessageAttachment,
} from 'api-server/chat/domain/models/chatMessage';
import { SendMessage } from 'api-server/chat/domain/usecases/sendChatMessage';
import chatServer from 'api-server/chat/chatTcpServer/server';
import { IRequest } from 'api-server/main/protocols/requestContext';
import { getMembersIdsForMessageType } from 'api-server/chat/chatUtils';
import {
  ChatActivity,
  ChatActivityKind,
  ChatMemberType,
} from 'api-server/chat/domain/models/chat';
import { UpdateChat } from 'api-server/chat/domain/usecases/updateChat';
import { Express } from 'express';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, ok } from '../../helpers';

export class SendMessageController implements Controller {
  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly sendChatMessage: SendMessage,
    private readonly updateChat: UpdateChat
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
    if (request.isSystemMessage === true) {
      messageType = 'system';
    }

    const recipients = getMembersIdsForMessageType(
      chat,
      messageType,
      ChatMemberType.brain
    );

    const attachments = request.files?.map((f) => ({
      data: f.buffer,
      mimeType: f.mimetype,
      originalFileName: f.originalname,
    })) as RawMessageAttachment[];

    // TODO: Validate attachments

    const addedMessage = await this.sendChatMessage.send({
      chatId: request.chatId,
      senderId,
      text: request.text,
      image: request.image,
      voice: request.voice,
      hidden: request.hidden,
      attachments,
      messageType,
      status: ChatMessageStatus.SENT,
      recipients: recipients || [],
    });

    chatServer.notifyMessageReceived(addedMessage);

    const updated = await this.updateChat.execute({
      id: chat.id,
      lastActivity: this.getLastActivityForMessage(addedMessage),
    });

    chatServer.notifyChatUpdated(updated);

    return ok({ id: addedMessage.id });
  };

  getLastActivityForMessage = (message: ChatMessageModel): ChatActivity => {
    const lastActivity: ChatActivity = {
      executorId: message.senderId,
      dateUtc: message.sendDate,
      value: message.text?.body?.substring(0, 100) ?? 'Text message',
      kind: ChatActivityKind.textMessage,
    };

    if (message.image)
      return {
        ...lastActivity,
        value: message.image?.caption ?? '',
        kind: ChatActivityKind.imageMessage,
      };

    if (message.voice)
      return {
        ...lastActivity,
        value: message.voice?.file,
        kind: ChatActivityKind.voiceMessage,
      };

    return lastActivity;
  };
}

export namespace SendMessageController {
  export type Request = IRequest & {
    chatId: string;
    text?: TextMessage;
    image?: ImageMessage;
    voice?: VoiceMessage;
    attachments?: RawMessageAttachment[];
    recipientSettings: IRecipientSettings;
    hidden?: boolean;
    files?: Express.Multer.File[];
    isSystemMessage?: boolean;
  };
}
