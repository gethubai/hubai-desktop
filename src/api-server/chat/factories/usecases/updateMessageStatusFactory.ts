import { makeChatMessageRepository } from 'data/chat/factory';
import { UpdateMessageStatus } from '../../domain/usecases/updateMessagesStatus';
import LocalUpdateMessageStatus from '../../data/usecases/localUpdateMessageStatus';

const makeUpdateMessageStatus = async (): Promise<UpdateMessageStatus> =>
  new LocalUpdateMessageStatus(await makeChatMessageRepository());

export default makeUpdateMessageStatus;
