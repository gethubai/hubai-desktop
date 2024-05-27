import { IContribute, IExtensionType } from '@hubai/core';
import {
  LocalExtensionSettingMap,
  LocalExtensionModel,
} from '../models/localExtension';

export type AddLocalExtensionParams = {
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

export type AddLocalExtensionModel = LocalExtensionModel;

export interface AddLocalExtension {
  add: (Extension: AddLocalExtensionParams) => Promise<AddLocalExtensionModel>;
}
