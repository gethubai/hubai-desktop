import { RealmLocalBrainRepository } from './realm/realmLocalBrainRepository';
import { getDatabase } from './realm/db';

export const makeLocalBrainRepository = async () =>
  new RealmLocalBrainRepository(await getDatabase());
