/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import { ChatDatabase } from '../../../../data/db';
import { LoadMessageForRecipient } from '../../domain/usecases/loadMessagesForRecipient';

export default class LocalLoadMessagesForRecipient
  implements LoadMessageForRecipient
{
  constructor(private readonly database: ChatDatabase) {}

  async loadMessages(
    params: LoadMessageForRecipient.Params
  ): Promise<LoadMessageForRecipient.Model[]> {
    const { recipientId, messageStatus } = params;
    const selector: any = {
      to: {
        $eq: recipientId,
      },
    };

    if (params.messageStatus) {
      selector.status = {
        $eq: messageStatus,
      };
    }
    const messages = await this.database.messages.find({ selector }).exec();

    const model: LoadMessageForRecipient.Model[] = [];

    for (const message of messages) {
      const chatId = message.chat;
      const messageContext = model.find((m) => m.chat.id == chatId);

      if (messageContext) {
        messageContext.messages.push(message);
      } else {
        const chat = await message.populate('chat');
        model.push(new ChatMessagesContext(chat._data, [message]));
      }
    }

    return model;
  }
}
