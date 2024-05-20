import {
  ChatMessageRecipient,
  ChatMessageStatus,
  MessageAttachment,
} from 'api-server/chat/domain/models/chatMessage';
import {
  SendChatMessageParams,
  SendChatMessageModel,
  SendMessage,
} from 'api-server/chat/domain/usecases/sendChatMessage';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { IChatMessageRepository } from 'data/chat/chatMessageRepository';
import { SaveFileChat } from 'api-server/chat/domain/usecases/saveFile';

export default class LocalSendChatMessage implements SendMessage {
  constructor(
    private readonly repository: IChatMessageRepository,
    private readonly saveChatFile: SaveFileChat
  ) {}

  async send(params: SendChatMessageParams): Promise<SendChatMessageModel> {
    const {
      senderId,
      senderType,
      text,
      image,
      voice,
      messageType,
      chatId,
      recipients,
      hidden,
      attachments: rawAttachments,
    } = params;

    const id = generateUniqueId();

    const attachments: MessageAttachment[] = [];

    if (rawAttachments) {
      // eslint-disable-next-line no-restricted-syntax
      for (const attachment of rawAttachments) {
        try {
          const {
            id: attachmentId,
            file,
            mimeType,
            attachmentType,
          } = await this.saveChatFile.saveFile(attachment);

          attachments.push({
            id: attachmentId,
            file,
            mimeType,
            attachmentType,
            size: attachment.data.byteLength,
            originalFileName: attachment.originalFileName,
          });
        } catch (err) {
          console.error('Error saving attachment', attachment, err);
        }
      }
    }

    const message = await this.repository.add({
      id,
      senderId,
      senderType,
      text,
      image,
      voice,
      messageType,
      chat: chatId,
      sendDate: new Date().toISOString(),
      recipients: recipients.map(
        (r) =>
          ({ id: r, status: ChatMessageStatus.WAITING }) as ChatMessageRecipient
      ),
      status: ChatMessageStatus.SENT,
      attachments,
      hidden,
    });

    return message;
  }
}
