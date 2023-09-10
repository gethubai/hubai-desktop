import { LocalPackage } from 'api-server/packages/model/package';
import { PackageType } from './package';

export type PackageInstallationResult<TPackage extends LocalPackage> = {
  success: boolean;
  error?: Error;
  result?: TPackage;
};

export type PackageUninstallationResult = {
  success: boolean;
  error?: Error;
};

export interface ILocalPackageManagementService<TPackage extends LocalPackage> {
  getPackages(): TPackage[];
  packageType: PackageType;
  getPackageByName(name: string): TPackage | undefined;
  getPackageSettings(packageId: string): any;

  onPackageSettingsUpdated(
    callback: (localPackage: TPackage, settings: any) => void
  ): void;

  installPackage(packagePath: string): PackageInstallationResult<TPackage>;
  uninstallPackage(localPackage: TPackage): PackageUninstallationResult;

  onPackageInstalled(callback: (localPackage: TPackage) => void): void;
  onPackageUninstalled(callback: (localPackage: TPackage) => void): void;
}
