/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Realm from 'realm';
import path from 'path';
import {
  BrainCapability,
  BrainSettingScope,
  LocalBrainModel,
  LocalBrainSettingMap,
} from 'api-server/brain/domain/models/localBrain';
import {
  createDirectoryIfNotExists,
  getAppDatabaseStoragePath,
} from 'utils/pathUtils';
import keyStore from 'data/keyStore';
import { SettingType } from 'api-server/models/settingMap';

/*
Realm supports the following primitive data types:
https://www.mongodb.com/docs/realm/sdk/node/model-data/define-a-realm-object-model/#supported-property-types
*/

export class LocalBrainDto extends Realm.Object<LocalBrainModel> {
  id!: string;

  name!: string;

  displayName!: string;

  description?: string;

  version!: string;

  main!: string;

  capabilities!: BrainCapability[];

  settingsMap?: LocalBrainSettingMap[];

  installationDateUtc?: Date;

  updatedDateUtc?: Date;

  icon?: string;

  iconUrl?: string;

  publisher?: string;

  disabled?: boolean;

  public static schema: Realm.ObjectSchema = {
    name: 'LocalBrain',
    properties: {
      id: 'string',
      name: { type: 'string', indexed: true },
      displayName: { type: 'string', indexed: true },
      description: 'string?',
      version: 'string',
      main: 'string',
      capabilities: 'string[]',
      settingsMap: { type: 'list', objectType: 'LocalBrainSettingMap' },
      installationDateUtc: 'date',
      updatedDateUtc: 'date?',
      icon: 'string?',
      iconUrl: 'string?',
      publisher: 'string?',
      disabled: { type: 'bool', default: false },
    },
    primaryKey: 'id',
  };

  get values(): LocalBrainModel {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      description: this.description,
      version: this.version,
      main: this.main,
      capabilities: this.capabilities.map((item) => item as BrainCapability),
      settingsMap: this.settingsMap?.map((item) => (item as any).values),
      installationDateUtc: this.installationDateUtc,
      updatedDateUtc: this.updatedDateUtc,
      icon: this.icon,
      iconUrl: this.iconUrl,
      publisher: this.publisher,
      disabled: this.disabled,
    } as LocalBrainModel;
  }
}

class LocalBrainSettingMapDto extends Realm.Object<LocalBrainSettingMap> {
  name!: string;

  displayName!: string;

  type!: SettingType;

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
      displayName: 'string',
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
      displayName: this.displayName,
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
