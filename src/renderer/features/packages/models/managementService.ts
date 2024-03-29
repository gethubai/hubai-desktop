import { DownloadProgress } from 'renderer/features/downloader/models';
import { HubAIPackage, PackageVersion } from './package';

export type PackageResult = {
  success: boolean;
  error?: Error;
};

export type PackageDownloadResult = PackageResult & {
  downloadPath?: string;
  fileSize?: number;
  fileMimeType?: string;
};

export type PackageInstallationResult = PackageResult;

export type PackageUninstallationResult = PackageResult;

export enum PackageEvents {
  PackageInstallationStarted = 'package-installation-started',
  PackageInstalled = 'package-installed',
  PackageUninstalled = 'package-uninstalled',
  PackageDownloaded = 'package-downloaded',
  PackageDownloadProgress = 'package-download-progress',
}
export type PackageVersionCompatibilityResult = {
  isCompatible: boolean;
  incompatibilityReason?: string;
}

export interface IPackageManagementService {
  startPackageDownload(
    hubaiPackage: HubAIPackage,
    version?: string,
    captchaToken?: string
  ): Promise<PackageDownloadResult>;

  isPackageInstalled(hubaiPackage: HubAIPackage): boolean;
  isPackageVersionCompatible(version: PackageVersion): PackageVersionCompatibilityResult;
  isPendingRemovalPackage(name: string): boolean;
  getInstalledPackages(): HubAIPackage[];
  getInstalledPackage(name: string): HubAIPackage | undefined;
  installPackage(
    hubaiPackage: HubAIPackage,
    version?: string,
    captchaToken?: string
  ): Promise<PackageInstallationResult>;
  uninstallPackage(
    hubaiPackage: HubAIPackage
  ): Promise<PackageUninstallationResult>;

  onPackageInstallationStarted(
    callback: (hubaiPackage: HubAIPackage) => void
  ): void;

  unsubscribe(
    eventName: PackageEvents,
    callback: (...args: any[]) => void
  ): void;

  onPackageInstalled(
    callback: (
      hubaiPackage: HubAIPackage,
      installationResult: PackageInstallationResult
    ) => void
  ): void;

  onPackageUninstalled(
    callback: (
      hubaiPackage: HubAIPackage,
      uninstallationResult: PackageUninstallationResult
    ) => void
  ): void;

  onPackageDownloaded(
    callback: (
      hubaiPackage: HubAIPackage,
      downloadResult: PackageDownloadResult
    ) => void
  ): void;

  onPackageDownloadProgress(
    callback: (
      hubaiPackage: HubAIPackage,
      downloadProgress: DownloadProgress
    ) => void
  ): void;
}
