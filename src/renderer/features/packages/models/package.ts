import { PackageInstallationState } from 'api-server/packages/model/packageInstallationState';

export enum PackageType {
  Extension = 'extension',
  Brain = 'brain',
}

export type PackageVersion = {
  id: string;
  version: string;
  requiredEngineVersion: string;
  assetUri: string;
  releaseDate: string;
  assets: Array<{
    assetType: string;
    source: string;
  }>;
};

export type PackageResource = {
  id: string;
  value: string;
};

export type PackageCapability = {
  name: string;
  displayName: string;
  description: string;
};

export type HubAIPackage = {
  id: string;
  name: string;
  displayName: string;
  shortDescription?: string;
  tags?: string[];
  icon?: string;
  categories?: string[];
  capabilities?: PackageCapability[];
  publisherName: string;
  versions: PackageVersion[];
  resources?: PackageResource[];
  installedVersion?: string;
  packageType: PackageType;
  installationState?: PackageInstallationState;
};
