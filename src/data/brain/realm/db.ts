/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Realm from 'realm';
import path from 'path';
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import {
  createDirectoryIfNotExists,
  getAppDatabaseStoragePath,
} from 'utils/pathUtils';
import keyStore from 'data/keyStore';
import { ILocalBrainDto } from '../localBrainRepository';

/*
Realm supports the following primitive data types:
https://www.mongodb.com/docs/realm/sdk/node/model-data/define-a-realm-object-model/#supported-property-types
*/

export class LocalBrainDto extends Realm.Object<LocalBrainModel> {
  id!: string;

  name!: string;

  displayName!: string;

  version!: string;

  installationDateUtc?: Date;

  updatedDateUtc?: Date;

  disabled?: boolean;

  public static schema: Realm.ObjectSchema = {
    name: 'LocalBrain',
    properties: {
      id: 'string',
      name: { type: 'string', indexed: true },
      displayName: { type: 'string', indexed: true },
      version: 'string',
      installationDateUtc: 'date',
      updatedDateUtc: 'date?',
      disabled: { type: 'bool', default: false },
    },
    primaryKey: 'id',
  };

  get values(): ILocalBrainDto {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      version: this.version,
      installationDateUtc: this.installationDateUtc,
      updatedDateUtc: this.updatedDateUtc,
      disabled: this.disabled,
    } as ILocalBrainDto;
  }
}

const dbBasePath = getAppDatabaseStoragePath('local-brain');
createDirectoryIfNotExists(dbBasePath);

const dbPath = path.resolve(dbBasePath, 'database.realm');

const config = {
  schema: [LocalBrainDto],
  path: dbPath,
};

let dbPromise: Promise<Realm>;
export const getDatabase = async (): Promise<Realm> => {
  if (dbPromise != null) return dbPromise;

  dbPromise = Realm.open({ ...config, encryptionKey: keyStore.getBuffer() });

  return dbPromise;
};
