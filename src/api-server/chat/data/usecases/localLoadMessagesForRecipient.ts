/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import { IChatMessageRepository } from 'data/chat/chatMessageRepository';
import { IChatRepository } from 'data/chat/chatRepository';
import { LoadMessageForRecipient } from '../../domain/usecases/loadMessagesForRecipient';

export default class LocalLoadMessagesForRecipient
  implements LoadMessageForRecipient
{
  constructor(
    private readonly messageRepository: IChatMessageRepository,
    private readonly chatRepository: IChatRepository
  ) {}

  async loadMessages(
    params: LoadMessageForRecipient.Params
  ): Promise<LoadMessageForRecipient.Model[]> {
    const { recipientId, messageStatus } = params;

    const messages = await this.messageRepository.getAll({
      to: recipientId,
      status: messageStatus,
    });

    const model: LoadMessageForRecipient.Model[] = [];

    for (const message of messages) {
      const chatId = message.chat;
      const messageContext = model.find((m) => m.chat.id === chatId);

      if (messageContext) {
        messageContext.messages.push(message);
      } else {
        const chat = await this.chatRepository.get(chatId);
        if (chat) model.push(new ChatMessagesContext(chat, [message]));
        else
          console.warn(
            `Found an orphan message with id ${message.id} and chat id ${chatId}`
          );
      }
    }

    return model;
  }
}
