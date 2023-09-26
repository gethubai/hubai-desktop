import { makeChatRepository } from 'data/chat/factory';
import { UpdateChat } from 'api-server/chat/domain/usecases/updateChat';
import LocalUpdateChat from 'api-server/chat/data/usecases/localUpdateChat';

const makeUpdateChat = async (): Promise<UpdateChat> =>
  new LocalUpdateChat(await makeChatRepository());

export default makeUpdateChat;
