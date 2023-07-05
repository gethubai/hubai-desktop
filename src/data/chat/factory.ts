import { RealmChatMessageRepository } from './realm/realmChatMessageRepository';
import { RealmChatRepository } from './realm/realmChatRepository';
import { getDatabase } from './realm/db';

export const makeChatRepository = async () =>
  new RealmChatRepository(await getDatabase());

export const makeChatMessageRepository = async () =>
  new RealmChatMessageRepository(await getDatabase());
