import {
  makeChatMessageRepository,
  makeChatRepository,
} from 'data/chat/factory';
import LocalLoadMessagesForRecipient from '../../data/usecases/localLoadMessagesForRecipient';
import { LoadMessageForRecipient } from '../../domain/usecases/loadMessagesForRecipient';
import makeGetUserProfile from './getUserProfileFactory';

const makeLoadMessagesForRecipient =
  async (): Promise<LoadMessageForRecipient> =>
    new LocalLoadMessagesForRecipient(
      await makeChatMessageRepository(),
      await makeChatRepository(),
      await makeGetUserProfile()
    );

export default makeLoadMessagesForRecipient;
