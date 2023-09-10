import { PackageInstallationState } from './packageInstallationState';

export type LocalPackage = {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  version: string;
  main: string;
  icon?: string;
  iconUrl?: string;
  publisher?: string;
  installationState?: PackageInstallationState;
  installationDateUtc?: Date;
  updatedDateUtc?: Date;
  disabled?: boolean;
};
