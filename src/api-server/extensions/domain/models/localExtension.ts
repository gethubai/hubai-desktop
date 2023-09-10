import { IContribute, IExtensionType } from '@hubai/core';
import { SettingMap } from 'api-server/models/settingMap';
import { LocalPackage } from 'api-server/packages/model/package';

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

export type LocalExtensionModel = LocalPackage & {
  extensionKind?: IExtensionType[];
  contributes?: IContribute;
  path?: string;
};
