import {
  ChatMessageRecipient,
  ChatMessageStatus,
} from 'api-server/chat/domain/models/chatMessage';
import {
  SendChatMessage,
  SendMessage,
} from 'api-server/chat/domain/usecases/sendChatMessage';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { IChatMessageRepository } from 'data/chat/chatMessageRepository';

export default class LocalSendChatMessage implements SendMessage {
  constructor(private readonly repository: IChatMessageRepository) {}

  async send(params: SendChatMessage.Params): Promise<SendChatMessage.Model> {
    const {
      senderId,
      text,
      image,
      voice,
      messageType,
      chatId,
      recipients,
      hidden,
    } = params;

    const id = generateUniqueId();

    const message = await this.repository.add({
      id,
      senderId,
      text,
      image,
      voice,
      messageType,
      chat: chatId,
      sendDate: new Date().toISOString(),
      recipients: recipients.map(
        (r) =>
          ({ id: r, status: ChatMessageStatus.WAITING } as ChatMessageRecipient)
      ),
      status: ChatMessageStatus.SENT,
      hidden,
    });

    return message;
  }
}
