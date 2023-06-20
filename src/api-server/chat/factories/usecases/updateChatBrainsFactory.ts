import { UpdateChatBrains } from 'api-server/chat/domain/usecases/updateChatBrains';
import LocalUpdateChatBrains from 'api-server/chat/data/usecases/localUpdateChatBrains';
import makeChatDatabase from '../databaseFactory';

const makeUpdateChatBrains = async (): Promise<UpdateChatBrains> =>
  new LocalUpdateChatBrains(await makeChatDatabase());

export default makeUpdateChatBrains;
