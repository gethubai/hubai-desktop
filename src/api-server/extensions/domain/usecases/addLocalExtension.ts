import { IContribute, IExtensionType } from '@hubai/core';
import {
  LocalExtensionSettingMap,
  LocalExtensionModel,
} from '../models/localExtension';

export interface AddLocalExtension {
  add: (
    Extension: AddLocalExtension.Params
  ) => Promise<AddLocalExtension.Model>;
}

export namespace AddLocalExtension {
  export type Params = {
    name: string;
    displayName: string;
    version: string;
    extensionKind?: IExtensionType[];
    contributes?: IContribute;
    settingsMap?: LocalExtensionSettingMap[];
    main: string;
    icon?: string;
    iconUrl?: string;
    description?: string;
    publisher?: string;
    path?: string;
    remoteUrl?: string;
  };
  export type Model = LocalExtensionModel;
}
