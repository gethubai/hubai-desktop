import LocalLoadMessagesForRecipient from '../../data/usecases/localLoadMessagesForRecipient';
import { LoadMessageForRecipient } from '../../domain/usecases/loadMessagesForRecipient';
import makeChatDatabase from '../databaseFactory';

const makeLoadMessagesForRecipient =
  async (): Promise<LoadMessageForRecipient> =>
    new LocalLoadMessagesForRecipient(await makeChatDatabase());

export default makeLoadMessagesForRecipient;
