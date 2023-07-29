import { makeChatMessageRepository } from 'data/chat/factory';
import { makeLocalBrainRepository } from 'data/brain/factory';
import makeCurrentUserService from 'api-server/user/factories/currentUserServiceFactory';
import LocalLoadMessagesForRecipient from '../../data/usecases/localLoadMessagesForRecipient';
import { LoadMessageForRecipient } from '../../domain/usecases/loadMessagesForRecipient';

const makeLoadMessagesForRecipient =
  async (): Promise<LoadMessageForRecipient> =>
    new LocalLoadMessagesForRecipient(
      await makeChatMessageRepository(),
      await makeLocalBrainRepository(),
      makeCurrentUserService()
    );

export default makeLoadMessagesForRecipient;
