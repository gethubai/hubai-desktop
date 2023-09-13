import { IContactRepository } from './contactRepository';
import { getDatabase } from './realm/db';
import { RealmContactRepository } from './realm/realmContactRepository';

export const makeContactRepository = async (): Promise<IContactRepository> =>
  new RealmContactRepository(await getDatabase());
