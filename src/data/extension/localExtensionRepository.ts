import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';

export interface ILocalExtensionRepository {
  add: (extension: LocalExtensionModel) => Promise<LocalExtensionModel>;
  update: (extension: LocalExtensionModel) => Promise<LocalExtensionModel>;
  getExtensions: () => Promise<LocalExtensionModel[]>;
  getExtension: (id: string) => Promise<LocalExtensionModel | undefined>;
  getExtensionByName: (
    name: string
  ) => Promise<LocalExtensionModel | undefined>;
}
