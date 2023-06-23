/* eslint-disable import/prefer-default-export */
import { createRxDatabase, addRxPlugin, RxStorage, RxDatabase } from 'rxdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import IsDevelopment from 'utils/isDevelopment';
import {
  ChatDatabaseCollections,
  ChatMessageSchema,
  ChatSchema,
} from './schemas';

addRxPlugin(RxDBQueryBuilderPlugin);

if (IsDevelopment()) addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBUpdatePlugin);

export type ChatDatabase = RxDatabase<ChatDatabaseCollections>;

export async function internalGetChatDatabase(
  storage: RxStorage<any, any>
): Promise<ChatDatabase> {
  const db = await createRxDatabase<ChatDatabase>({
    name: 'chatdb',
    storage,
    multiInstance: false,
  });

  await db.addCollections({
    chat: {
      schema: ChatSchema,
    },
    messages: {
      schema: ChatMessageSchema,
    },
  });

  return db;
}
