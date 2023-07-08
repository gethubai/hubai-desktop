import { IContribute, IExtensionType } from '@hubai/core';
import { SettingMap } from 'api-server/models/settingMap';

export class LocalExtensionSettingMap extends SettingMap {
  constructor(
    name: string,
    displayName: string,
    type: string,
    required?: boolean,
    defaultValue?: string,
    enumValues?: string[],
    description?: string
  ) {
    super(
      name,
      displayName,
      type,
      required,
      defaultValue,
      enumValues,
      description
    );
  }
}

export type LocalExtensionModel = {
  id: string;
  name: string;
  displayName: string;
  version: string;
  // categories?: IExtensionType[];
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
};
