/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Realm from 'realm';
import path from 'path';
import {
  BrainCapability,
  BrainSettingScope,
  BrainSettingType,
  LocalBrainModel,
  LocalBrainSettingMap,
} from 'api-server/brain/domain/models/localBrain';
import {
  createDirectoryIfNotExists,
  getAppDatabaseStoragePath,
} from 'utils/pathUtils';
import keyStore from 'data/keyStore';

/*
Realm supports the following primitive data types:
https://www.mongodb.com/docs/realm/sdk/node/model-data/define-a-realm-object-model/#supported-property-types
*/

export class LocalBrainDto extends Realm.Object<LocalBrainModel> {
  id!: string;

  name!: string;

  title!: string;

  description?: string;

  version!: string;

  main!: string;

  capabilities!: BrainCapability[];

  settingsMap?: LocalBrainSettingMap[];

  installationDate?: Date;

  updatedDate?: Date;

  public static schema: Realm.ObjectSchema = {
    name: 'LocalBrain',
    properties: {
      id: 'string',
      name: { type: 'string', indexed: true },
      title: { type: 'string', indexed: true },
      description: 'string?',
      version: 'string',
      main: 'string',
      capabilities: 'string[]',
      settingsMap: { type: 'list', objectType: 'LocalBrainSettingMap' },
      installationDate: 'date',
      updatedDate: 'date?',
    },
    primaryKey: 'id',
  };

  get values(): LocalBrainModel {
    return {
      id: this.id,
      name: this.name,
      title: this.title,
      description: this.description,
      version: this.version,
      main: this.main,
      capabilities: this.capabilities.map((item) => item as BrainCapability),
      settingsMap: this.settingsMap?.map((item) => (item as any).values),
      installationDate: this.installationDate,
      updatedDate: this.updatedDate,
    } as LocalBrainModel;
  }
}

class LocalBrainSettingMapDto extends Realm.Object<LocalBrainSettingMap> {
  name!: string;

  title!: string;

  type!: BrainSettingType;

  enumValues?: string[];

  defaultValue?: string;

  required!: boolean;

  description?: string;

  scope!: BrainSettingScope;

  static schema = {
    name: 'LocalBrainSettingMap',
    embedded: true,
    properties: {
      name: 'string',
      title: 'string',
      type: 'string',
      enumValues: 'string[]',
      defaultValue: 'string?',
      required: { type: 'bool', default: false },
      description: 'string?',
      scope: { type: 'string', default: BrainSettingScope.APPLICATION },
    },
  };

  get values(): LocalBrainSettingMap {
    return {
      name: this.name,
      title: this.title,
      type: this.type,
      enumValues: Array.from(this.enumValues ?? []),
      defaultValue: this.defaultValue,
      required: this.required,
      description: this.description,
      scope: this.scope,
    } as LocalBrainSettingMap;
  }
}

const dbBasePath = getAppDatabaseStoragePath('local-brain');
createDirectoryIfNotExists(dbBasePath);

const dbPath = path.resolve(dbBasePath, 'database.realm');

const config = {
  schema: [LocalBrainDto, LocalBrainSettingMapDto],
  path: dbPath,
};

let dbPromise: Promise<Realm>;
export const getDatabase = async (): Promise<Realm> => {
  if (dbPromise != null) return dbPromise;

  dbPromise = Realm.open({ ...config, encryptionKey: keyStore.getBuffer() });

  return dbPromise;
};
