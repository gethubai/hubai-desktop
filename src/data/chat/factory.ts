import { RealmChatMessageRepository } from './realm/realmChatMessageRepository';
import { RealmChatRepository } from './realm/realmChatRepository';
import { getDatabase } from './realm/db';
import { IChatRepository } from './chatRepository';
import { IChatMessageRepository } from './chatMessageRepository';

export const makeChatRepository = async (): Promise<IChatRepository> =>
  new RealmChatRepository(await getDatabase());

export const makeChatMessageRepository =
  async (): Promise<IChatMessageRepository> =>
    new RealmChatMessageRepository(await getDatabase());
