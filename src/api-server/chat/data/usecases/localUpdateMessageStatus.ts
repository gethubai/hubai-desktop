import { ChatDatabase } from '../../../../data/db';
import { ChatMessageModel } from '../../domain/models/chatMessage';
import { UpdateMessageStatus } from '../../domain/usecases/updateMessagesStatus';

export default class LocalUpdateMessageStatus implements UpdateMessageStatus {
  constructor(private readonly database: ChatDatabase) {}

  update = async (
    ids: UpdateMessageStatus.Params
  ): Promise<UpdateMessageStatus.Model> => {
    const { messageIds, newStatus } = ids;

    const query = this.database.messages.find({
      selector: {
        id: {
          $in: messageIds,
        },
      },
    });

    const updated = await query.update({
      $set: {
        status: newStatus,
      },
    });

    return updated._data as ChatMessageModel[];
  };
}
