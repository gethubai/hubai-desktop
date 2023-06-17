import { ChatMessageStatus } from 'api-server/chat/domain/models/chatMessage';
import {
  SendChatMessage,
  SendMessage,
} from 'api-server/chat/domain/usecases/sendChatMessage';
import { ChatDatabase } from 'data/db';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';

export default class LocalSendChatMessage implements SendMessage {
  constructor(private readonly database: ChatDatabase) {}

  async send(params: SendChatMessage.Params): Promise<SendChatMessage.Model> {
    const {
      sender,
      senderId,
      text,
      image,
      voice,
      messageType,
      chatId,
      senderType,
      to,
    } = params;
    const message = await this.database.messages.insert({
      id: generateUniqueId(),
      sender,
      senderId,
      senderType,
      text,
      image,
      voice,
      messageType,
      chat: chatId,
      sendDate: new Date().toISOString(),
      to,
      status: ChatMessageStatus.SENT,
    });

    return message._data as SendChatMessage.Model;
  }
}
