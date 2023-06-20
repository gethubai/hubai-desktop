import { ChatDatabase, internalGetChatDatabase } from './db';
import getStorage from '../storage';

export function getChatDatabase(): Promise<ChatDatabase> {
  return internalGetChatDatabase(getStorage());
}
