/* eslint-disable import/prefer-default-export */
import { createRxDatabase, addRxPlugin, RxStorage, RxDatabase } from 'rxdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import IsDevelopment from 'utils/isDevelopment';
import { BrainDatabaseCollections, LocalBrainSchema } from './schemas';

addRxPlugin(RxDBQueryBuilderPlugin);

if (IsDevelopment()) addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBUpdatePlugin);

export type Database = RxDatabase<BrainDatabaseCollections>;

export async function internalGetDatabase(
  storage: RxStorage<any, any>
): Promise<Database> {
  const db = await createRxDatabase<Database>({
    name: 'braindb',
    storage,
    multiInstance: false,
  });

  await db.addCollections({
    brains: {
      schema: LocalBrainSchema,
    },
  });

  return db;
}
