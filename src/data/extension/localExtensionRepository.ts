import { LocalExtensionModel } from 'api-server/extensions/domain/models/localExtension';

export interface ILocalExtensionDto {
  id: string;
  name: string;
  displayName: string;
  version: string;
  path?: string;
  disabled?: boolean;
  installationDateUtc?: Date;
  updatedDateUtc?: Date;
  remoteUrl?: string;
}

export interface ILocalExtensionRepository {
  add: (extension: LocalExtensionModel) => Promise<ILocalExtensionDto>;
  update: (extension: LocalExtensionModel) => Promise<ILocalExtensionDto>;
  remove: (id: string) => Promise<void>;
  getExtensions: () => Promise<ILocalExtensionDto[]>;
  getExtension: (id: string) => Promise<ILocalExtensionDto | undefined>;
  getExtensionByName: (name: string) => Promise<ILocalExtensionDto | undefined>;
}
