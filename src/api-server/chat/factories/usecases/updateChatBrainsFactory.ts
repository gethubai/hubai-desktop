import { UpdateChatBrains } from 'api-server/chat/domain/usecases/updateChatBrains';
import LocalUpdateChatBrains from 'api-server/chat/data/usecases/localUpdateChatBrains';
import { makeChatRepository } from 'data/chat/factory';

const makeUpdateChatBrains = async (): Promise<UpdateChatBrains> =>
  new LocalUpdateChatBrains(await makeChatRepository());

export default makeUpdateChatBrains;
