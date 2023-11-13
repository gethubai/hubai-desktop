import { RealmLocalBrainRepository } from './realm/realmLocalBrainRepository';
import { getDatabase } from './realm/db';
import { ILocalBrainRepository } from './localBrainRepository';

export const makeLocalBrainRepository =
  async (): Promise<ILocalBrainRepository> =>
    new RealmLocalBrainRepository(await getDatabase());
