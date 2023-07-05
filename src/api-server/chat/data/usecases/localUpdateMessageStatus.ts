/* eslint-disable no-restricted-syntax */
import { IChatMessageRepository } from 'data/chat/chatMessageRepository';
import { ChatMessageModel } from '../../domain/models/chatMessage';
import { UpdateMessageStatus } from '../../domain/usecases/updateMessagesStatus';

export default class LocalUpdateMessageStatus implements UpdateMessageStatus {
  constructor(private readonly repository: IChatMessageRepository) {}

  update = async (
    ids: UpdateMessageStatus.Params
  ): Promise<UpdateMessageStatus.Model> => {
    const { messageIds, newStatus } = ids;

    const messages = await this.repository.getAll({ ids: messageIds });

    // TODO: Use bulk update
    for (const message of messages) {
      message.status = newStatus;

      // eslint-disable-next-line no-await-in-loop
      await this.repository.update(message);
    }

    return messages as ChatMessageModel[];
  };
}
