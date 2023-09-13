import path from 'path';
import Realm from 'realm';
import {
  createDirectoryIfNotExists,
  getAppDatabaseStoragePath,
} from 'utils/pathUtils';
import keyStore from 'data/keyStore';
import { IContactDto } from '../contactRepository';

export class ContactDto extends Realm.Object<IContactDto> {
  id!: string;

  name!: string;

  originalName!: string;

  avatar?: string;

  createdDateUtc?: Date;

  updatedDateUtc?: Date;

  owner_id?: string;

  public static schema: Realm.ObjectSchema = {
    name: 'Contact',
    properties: {
      id: 'string',
      name: { type: 'string', indexed: true },
      originalName: 'string',
      avatar: 'string?',
      createdDateUtc: 'date',
      updatedDateUtc: 'date?',
      owner_id: 'string?',
    },
    primaryKey: 'id',
  };

  get values(): IContactDto {
    return {
      id: this.id,
      name: this.name,
      originalName: this.originalName,
      avatar: this.avatar,
      createdDateUtc: this.createdDateUtc,
      updatedDateUtc: this.updatedDateUtc,
    } as IContactDto;
  }
}

const dbBasePath = getAppDatabaseStoragePath('contact');
createDirectoryIfNotExists(dbBasePath);

const dbPath = path.resolve(dbBasePath, 'database.realm');

const config = {
  schema: [ContactDto],
  path: dbPath,
};

let dbPromise: Promise<Realm>;
export const getDatabase = async (): Promise<Realm> => {
  if (dbPromise != null) return dbPromise;

  dbPromise = Realm.open({ ...config, encryptionKey: keyStore.getBuffer() });

  return dbPromise;
};
