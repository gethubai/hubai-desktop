import { ChatDatabase } from 'data/chat/db';
import isRenderer from '../../../utils/isRenderer';
// import { getChatDatabase as getChatDatabaseRenderer } from '../../../data/db-renderer';
import { getChatDatabase as getChatDatabaseMain } from '../../../data/chat/db-main';

let dbPromise: Promise<ChatDatabase>;

const makeChatDatabase = async (): Promise<ChatDatabase> => {
  //  if (db != null) return db;
  if (dbPromise != null) return dbPromise;

  if (isRenderer()) {
    throw new Error('Database should not be called from renderer');
    // dbPromise = getChatDatabaseRenderer();
  } else {
    dbPromise = getChatDatabaseMain();
  }

  return dbPromise;
};

export default makeChatDatabase;
