import {
  makeChatMessageRepository,
  makeChatRepository,
} from 'data/chat/factory';
import LocalLoadMessagesForRecipient from '../../data/usecases/localLoadMessagesForRecipient';
import { LoadMessageForRecipient } from '../../domain/usecases/loadMessagesForRecipient';

const makeLoadMessagesForRecipient =
  async (): Promise<LoadMessageForRecipient> =>
    new LocalLoadMessagesForRecipient(
      await makeChatMessageRepository(),
      await makeChatRepository()
    );

export default makeLoadMessagesForRecipient;
