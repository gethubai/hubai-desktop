import { LocalExtensionModel } from '../models/localExtension';

export type LoadLocalExtensionsModel = LocalExtensionModel;

export interface LoadLocalExtensions {
  getExtensions: () => Promise<LoadLocalExtensionsModel[]>;
}
