/* eslint-disable max-classes-per-file */
import Realm from 'realm';
import path from 'path';
import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';
import {
  createDirectoryIfNotExists,
  getAppDatabaseStoragePath,
} from 'utils/pathUtils';
import keyStore from 'data/keyStore';
import { ILocalExtensionDto } from '../localExtensionRepository';

export class LocalExtensionDto extends Realm.Object<LocalExtensionModel> {
  id!: string;

  name!: string;

  displayName!: string;

  version!: string;

  path?: string;

  disabled?: boolean;

  installationDateUtc?: Date;

  updatedDateUtc?: Date;

  public static schema: Realm.ObjectSchema = {
    name: 'LocalExtension',
    properties: {
      id: 'string',
      name: { type: 'string', indexed: true },
      displayName: { type: 'string', indexed: true },
      version: 'string',
      path: 'string?',
      disabled: 'bool?',
      installationDateUtc: 'date',
      updatedDateUtc: 'date?',
    },
    primaryKey: 'id',
  };

  get values(): ILocalExtensionDto {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      version: this.version,
      path: this.path,
      disabled: this.disabled,
      installationDateUtc: this.installationDateUtc,
      updatedDateUtc: this.updatedDateUtc,
    } as ILocalExtensionDto;
  }
}

const dbBasePath = getAppDatabaseStoragePath('local-extension');
createDirectoryIfNotExists(dbBasePath);

const dbPath = path.resolve(dbBasePath, 'database.realm');

const config = {
  schema: [LocalExtensionDto],
  path: dbPath,
};

let dbPromise: Promise<Realm>;
export const getDatabase = async (): Promise<Realm> => {
  if (dbPromise != null) return dbPromise;

  dbPromise = Realm.open({ ...config, encryptionKey: keyStore.getBuffer() });

  return dbPromise;
};
