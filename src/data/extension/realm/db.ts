/* eslint-disable max-classes-per-file */
import Realm from 'realm';
import path from 'path';
import {
  LocalExtensionModel,
  LocalExtensionSettingMap,
} from 'api-server/extensions/domain/models/localExtension';
import type {
  ILocale,
  IContribute,
  IExtensionType,
  IColorTheme,
  ColorScheme,
  IColors,
  TokenColor,
} from '@hubai/core';
import { SettingType } from 'api-server/models/settingMap';
import {
  createDirectoryIfNotExists,
  getAppDatabaseStoragePath,
} from 'utils/pathUtils';
import keyStore from 'data/keyStore';
import { dictionaryToObject } from 'data/realm/helpers';

export class LocalExtensionDto extends Realm.Object<LocalExtensionModel> {
  id!: string;

  name!: string;

  displayName!: string;

  version!: string;

  categories?: IExtensionType[];

  extensionKind?: IExtensionType[];

  contributes?: IContribute;

  main?: string;

  icon?: string;

  description?: string;

  publisher?: string;

  path?: string;

  disable?: boolean;

  installationDateUtc?: Date;

  updatedDateUtc?: Date;

  public static schema: Realm.ObjectSchema = {
    name: 'LocalExtension',
    properties: {
      id: 'string',
      name: { type: 'string', indexed: true },
      displayName: { type: 'string', indexed: true },
      description: 'string?',
      version: 'string',
      extensionKind: 'string[]',
      contributes: 'Contribute?',
      icon: 'string?',
      publisher: 'string?',
      path: 'string?',
      disable: 'bool?',
      main: 'string',
      installationDateUtc: 'date',
      updatedDateUtc: 'date?',
    },
    primaryKey: 'id',
  };

  get values(): LocalExtensionModel {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      description: this.description,
      version: this.version,
      extensionKind: Array.from(this.extensionKind ?? []),
      contributes: (this.contributes as any)?.values,
      icon: this.icon,
      publisher: this.publisher,
      path: this.path,
      disable: this.disable,
      main: this.main,
      installationDateUtc: this.installationDateUtc,
      updatedDateUtc: this.updatedDateUtc,
    };
  }
}

class ContributeConfigurationDto extends Realm.Object<LocalExtensionSettingMap> {
  name!: string;

  displayName!: string;

  type!: SettingType;

  enumValues?: string[];

  defaultValue?: string;

  required!: boolean;

  description?: string;

  static schema = {
    name: 'ContributeConfiguration',
    embedded: true,
    properties: {
      name: 'string',
      displayName: 'string',
      type: 'string',
      enumValues: 'string[]',
      defaultValue: 'string?',
      required: { type: 'bool', default: false },
      description: 'string?',
    },
  };

  get values(): LocalExtensionSettingMap {
    return {
      name: this.name,
      displayName: this.displayName,
      type: this.type,
      enumValues: Array.from(this.enumValues ?? []),
      defaultValue: this.defaultValue,
      required: this.required,
      description: this.description,
    } as LocalExtensionSettingMap;
  }
}

export class ContributeLocaleDto extends Realm.Object<ILocale> {
  id!: string;

  name!: string;

  description?: string;

  inherit?: string;

  source!: Map<string, string>;

  static schema = {
    name: 'ContributeLocale',
    embedded: true,
    properties: {
      id: 'string',
      name: 'string',
      description: 'string?',
      inherit: 'string?',
      source: '{}',
    },
  };

  get values(): ILocale {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      inherit: this.inherit,
      source: this.source,
    } as ILocale;
  }
}

export class ContributeTokenColorDto extends Realm.Object<TokenColor> {
  name?: string;

  scope?: string | string[];

  settings?: object;

  static schema = {
    name: 'ContributeTokenColor',
    embedded: true,
    properties: {
      name: 'string?',
      scope: 'string[]',
      settings: '{}',
    },
  };

  get values(): TokenColor {
    return {
      name: this.name,
      scope: this.scope,
      settings: dictionaryToObject(this.settings as any),
    } as TokenColor;
  }
}

export class ContributeColorThemeDto extends Realm.Object<IColorTheme> {
  id!: string;

  label!: string;

  name?: string;

  uiTheme?: string;

  path?: string;

  description?: string;

  type?: ColorScheme;

  colors?: IColors;

  tokenColors?: TokenColor[];

  semanticHighlighting?: boolean;

  static schema = {
    name: 'ContributeColorTheme',
    embedded: true,
    properties: {
      id: 'string',
      label: 'string',
      name: 'string?',
      uiTheme: 'string?',
      path: 'string?',
      description: 'string?',
      type: 'string?',
      colors: 'string{}',
      tokenColors: { type: 'list', objectType: 'ContributeTokenColor' },
      semanticHighlighting: 'bool?',
    },
  };

  get values(): IColorTheme {
    return {
      id: this.id,
      label: this.label,
      name: this.name,
      uiTheme: this.uiTheme,
      path: this.path,
      description: this.description,
      type: this.type,
      colors: dictionaryToObject(this.colors as any),
      tokenColors: this.tokenColors?.map((l) => (l as any).values),
      semanticHighlighting: this.semanticHighlighting,
    } as IColorTheme;
  }
}

export class Contribute extends Realm.Object<IContribute> {
  languages?: ILocale[];

  themes?: IColorTheme[];

  configuration?: LocalExtensionSettingMap[];

  static schema = {
    name: 'Contribute',
    embedded: true,
    properties: {
      languages: { type: 'list', objectType: 'ContributeLocale' },
      themes: { type: 'list', objectType: 'ContributeColorTheme' },
      configuration: { type: 'list', objectType: 'ContributeConfiguration' },
    },
  };

  get values(): IContribute {
    return {
      languages: this.languages?.map((l) => (l as any).values),
      themes: this.themes?.map((l) => (l as any).values),
      configuration: this.configuration?.map((l) => (l as any).values),
    } as IContribute;
  }
}

const dbBasePath = getAppDatabaseStoragePath('local-extension');
createDirectoryIfNotExists(dbBasePath);

const dbPath = path.resolve(dbBasePath, 'database.realm');

const config = {
  schema: [
    LocalExtensionDto,
    Contribute,
    ContributeConfigurationDto,
    ContributeLocaleDto,
    ContributeColorThemeDto,
    ContributeTokenColorDto,
  ],
  path: dbPath,
};

let dbPromise: Promise<Realm>;
export const getDatabase = async (): Promise<Realm> => {
  if (dbPromise != null) return dbPromise;

  dbPromise = Realm.open({ ...config, encryptionKey: keyStore.getBuffer() });

  return dbPromise;
};
