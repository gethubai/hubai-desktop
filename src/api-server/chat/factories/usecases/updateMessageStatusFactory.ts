import { UpdateMessageStatus } from '../../domain/usecases/updateMessagesStatus';
import makeChatDatabase from '../databaseFactory';
import LocalUpdateMessageStatus from '../../data/usecases/localUpdateMessageStatus';

const makeUpdateMessageStatus = async (): Promise<UpdateMessageStatus> =>
  new LocalUpdateMessageStatus(await makeChatDatabase());

export default makeUpdateMessageStatus;
