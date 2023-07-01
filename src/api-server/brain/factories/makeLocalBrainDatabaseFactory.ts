import { Database } from 'data/brain/db';
import { getBrainDatabase } from 'data/brain/db-main';
import isRenderer from '../../../utils/isRenderer';

let dbPromise: Promise<Database>;

const makeLocalBrainDatabase = async (): Promise<Database> => {
  if (dbPromise != null) return dbPromise;

  if (isRenderer()) {
    throw new Error('Database should not be called from renderer');
  } else {
    dbPromise = getBrainDatabase();
  }

  return dbPromise;
};

export default makeLocalBrainDatabase;
