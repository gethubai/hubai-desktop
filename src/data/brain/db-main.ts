import { Database, internalGetDatabase } from './db';
import getStorage from '../storage';

export function getBrainDatabase(): Promise<Database> {
  return internalGetDatabase(getStorage());
}
