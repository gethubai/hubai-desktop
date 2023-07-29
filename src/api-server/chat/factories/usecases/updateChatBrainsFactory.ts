import { UpdateChatMembers } from 'api-server/chat/domain/usecases/updateChatBrains';
import LocalUpdateChatMembers from 'api-server/chat/data/usecases/localUpdateChatBrains';
import { makeChatRepository } from 'data/chat/factory';

const makeUpdateChatMembers = async (): Promise<UpdateChatMembers> =>
  new LocalUpdateChatMembers(await makeChatRepository());

export default makeUpdateChatMembers;
