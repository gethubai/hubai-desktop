import { HubAIPackage } from 'renderer/features/packages/models/package';

export type PackageStoreItem = HubAIPackage & {
  installed?: boolean;
  downloadCount: number;
};
