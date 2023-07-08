import { getDatabase } from 'data/extension/realm/db';
import { RealmLocalExtensionRepository } from 'data/extension/realm/realmLocalExtensionRepository';

export const makeLocalExtensionRepository = async () =>
  new RealmLocalExtensionRepository(await getDatabase());
