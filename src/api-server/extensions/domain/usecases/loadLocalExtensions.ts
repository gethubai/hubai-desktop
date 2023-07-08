import { LocalExtensionModel } from '../models/localExtension';

export interface LoadLocalExtensions {
  getExtensions: () => Promise<LoadLocalExtensions.Model[]>;
}

export namespace LoadLocalExtensions {
  export type Model = LocalExtensionModel;
}
