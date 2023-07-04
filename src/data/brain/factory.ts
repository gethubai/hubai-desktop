import { RealmLocalBrainRepository } from './realm/RealmLocalBrainRepository';
import { getDatabase } from './realm/db';

export const makeLocalBrainRepository = async () =>
  new RealmLocalBrainRepository(await getDatabase());
