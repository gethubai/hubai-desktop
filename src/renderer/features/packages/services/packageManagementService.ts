import { inject, injectable, singleton } from 'tsyringe';
import semver from 'semver';
import { type IExtensionManagementService } from 'renderer/features/extensions/services/extensionManagement';
import { type IBrainManagementService } from 'renderer/features/brain/services/brainManagement';
import { IHttpClient } from 'renderer/http/httpClient';
import {
  BuiltInHttpClient,
  type IHttpClientFactory,
} from 'renderer/http/httpClientFactory';
import { type IDownloadManager } from 'renderer/features/downloader/downloadManager';
import { EventEmitter } from '@hubai/core/esm/common/event';
import { DownloadProgress } from 'renderer/features/downloader/models';
import { HubAIPackage, PackageType, PackageVersion } from '../models/package';
import {
  IPackageManagementService,
  PackageDownloadResult,
  PackageEvents,
  PackageInstallationResult,
  PackageResult,
  PackageUninstallationResult,
  PackageVersionCompatibilityResult,
} from '../models/managementService';
import { ILocalPackageManagementService } from '../models/localPackageManagementService';

@singleton()
@injectable()
export class PackageManagementService implements IPackageManagementService {
  private readonly packageApiHttpClient: IHttpClient;

  private readonly eventEmitter: EventEmitter = new EventEmitter();

  private readonly localPackageManagementServices: Record<
    PackageType,
    ILocalPackageManagementService<any>
  >;

  private readonly pendingRemovalPackages: string[] = [];

  constructor(
    @inject('IExtensionManagementService')
    private readonly extensionManagementService: IExtensionManagementService,
    @inject('IBrainManagementService')
    private readonly brainManagementService: IBrainManagementService,
    @inject('IHttpClientFactory')
    private readonly httpClientFactory: IHttpClientFactory,
    @inject('IDownloadManager')
    private readonly downloadManager: IDownloadManager
  ) {
    this.packageApiHttpClient = this.httpClientFactory.createHttpClient(
      BuiltInHttpClient.packageApi
    );

    this.localPackageManagementServices = {
      [PackageType.Extension]: this.extensionManagementService,
      [PackageType.Brain]: this.brainManagementService,
    };

    Object.values(this.localPackageManagementServices).forEach((service) => {
      service.onPackageUninstalled((packageModel) => {
        this.pendingRemovalPackages.push(packageModel.name.toLowerCase());
      });
    });
  }

  isPendingRemovalPackage(name: string): boolean {
    return this.pendingRemovalPackages.includes(name.toLowerCase());
  }

  isPackageVersionCompatible(
    version: PackageVersion
  ): PackageVersionCompatibilityResult {
    let incompatibilityReason: string | undefined = undefined;
    const currentAppVersion = window.electron.getAppVersion();
    if (
      !semver.satisfies(currentAppVersion, version.requiredEngineVersion)
    ) {
      incompatibilityReason = `This package requires at least version ${version.requiredEngineVersion} of HubAI. \n\n Your current version is ${currentAppVersion}. \n\n Update HubAI to install this package.`;
    }

    return { isCompatible: !incompatibilityReason, incompatibilityReason: incompatibilityReason };
  }

  startPackageDownload = async (
    hubaiPackage: HubAIPackage,
    version?: string | undefined,
    captchaToken?: string
  ): Promise<PackageDownloadResult> => {
    return new Promise((resolve, reject) => {
      this.packageApiHttpClient
        .get<{
          downloadLink: string;
          expiresAtUtc: Date;
          version: string;
        }>(`/download/${hubaiPackage.id}`, {
          params: { version: version ?? 'latest', captchaToken },
        })
        .then((downloadUrl) => {
          if (!downloadUrl.success) {
            return {
              success: false,
              error: new Error(
                `An error occurred while downloading package ${hubaiPackage.name}: ${downloadUrl.error}`
              ),
            };
          }

          this.downloadManager.downloadFile(downloadUrl.result.downloadLink, {
            filename: `${hubaiPackage.name}-${downloadUrl.result.version}.hext`,
            showBadge: true,
            showProgressBar: true,
            overwrite: true,
            onProgress: (progress) => {
              this.eventEmitter.emit(
                PackageEvents.PackageDownloadProgress,
                hubaiPackage,
                progress
              );
            },
            onCancel: () => {
              console.warn('PACKAGE download cancelled', hubaiPackage);

              const downloadResult = {
                success: false,
                error: new Error('Download cancelled'),
              };
              this.eventEmitter.emit(
                PackageEvents.PackageDownloaded,
                hubaiPackage,
                downloadResult
              );

              resolve(downloadResult);
            },

            onError: (error) => {
              const downloadResult = {
                success: false,
                error,
              };
              console.error(
                'PACKAGE download error',
                downloadResult,
                hubaiPackage
              );

              this.eventEmitter.emit(
                PackageEvents.PackageDownloaded,
                hubaiPackage,
                downloadResult
              );
              resolve(downloadResult);
            },
            onCompleted: (file) => {
              const downloadResult = {
                success: true,
                downloadPath: file.path,
                fileSize: file.fileSize,
                fileMimeType: file.mimeType,
              };

              this.eventEmitter.emit(
                PackageEvents.PackageDownloaded,
                hubaiPackage,
                downloadResult
              );

              resolve(downloadResult);
            },
          });
        })
        .catch((error) => {
          console.log('PACKAGE download error', error, hubaiPackage);
          reject(error);
        });
    });
  };

  installPackage = async (
    hubaiPackage: HubAIPackage,
    version?: string | undefined,
    captchaToken?: string
  ): Promise<PackageInstallationResult> => {
    this.eventEmitter.emit(
      PackageEvents.PackageInstallationStarted,
      hubaiPackage
    );

    console.log(`Installing package: ${hubaiPackage.displayName}`);

    const downloadResult = await this.startPackageDownload(
      hubaiPackage,
      version,
      captchaToken
    );

    let installationResult: any = null;

    if (downloadResult.success && downloadResult.downloadPath) {
      installationResult = this.getPackageService(hubaiPackage).installPackage(
        downloadResult.downloadPath
      );

      console.log(installationResult, downloadResult);

      if (installationResult) {
        this.eventEmitter.emit(
          PackageEvents.PackageInstalled,
          hubaiPackage,
          installationResult
        );
        return installationResult;
      }
    }

    return {
      success: false,
      error: new Error(
        `An error occurred while downloading package ${hubaiPackage.displayName}: ${downloadResult.error}`
      ),
    };
  };

  uninstallPackage = async (
    hubaiPackage: HubAIPackage
  ): Promise<PackageUninstallationResult> => {
    const service = this.getPackageService(hubaiPackage);
    const packageToUninstall = service.getPackageByName(hubaiPackage.name);

    if (packageToUninstall === undefined) {
      const result = {
        success: false,
        error: new Error(`Package ${hubaiPackage.displayName} not found`),
      };

      this.eventEmitter.emit(
        PackageEvents.PackageUninstalled,
        hubaiPackage,
        result
      );

      return result;
    }

    const result = service.uninstallPackage(packageToUninstall);
    this.eventEmitter.emit(
      PackageEvents.PackageUninstalled,
      hubaiPackage,
      result
    );

    return result;
  };

  getPackageService = (hubaiPackage: HubAIPackage) =>
    this.localPackageManagementServices[hubaiPackage.packageType];

  getInstalledPackage(name: string): HubAIPackage | undefined {
    return this.getInstalledPackages().find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
  }

  isPackageInstalled(hubaiPackage: HubAIPackage): boolean {
    return this.getInstalledPackage(hubaiPackage.name) !== undefined;
  }

  getInstalledPackages = (): HubAIPackage[] => {
    const packages = Object.values(this.localPackageManagementServices).flatMap(
      (service) =>
        service.getPackages().map((p) => {
          return {
            id: p.id,
            name: p.name.toLowerCase(),
            displayName: p.displayName,
            publisherName: p.publisher ?? '',
            versions: [],
            installedVersion: p.version,
            installationState: p.installationState,
            packageType: service.packageType,
          } as HubAIPackage;
        })
    );
    return packages ?? [];
  };

  onPackageInstallationStarted = (
    callback: (hubaiPackage: HubAIPackage) => void
  ): void => {
    this.eventEmitter.subscribe(
      PackageEvents.PackageInstallationStarted,
      callback
    );
  };

  onPackageInstalled = (
    callback: (
      hubaiPackage: HubAIPackage,
      installationResult: PackageResult
    ) => void
  ): void => {
    this.eventEmitter.subscribe(PackageEvents.PackageInstalled, callback);
  };

  onPackageUninstalled = (
    callback: (
      hubaiPackage: HubAIPackage,
      uninstallationResult: PackageResult
    ) => void
  ): void => {
    this.eventEmitter.subscribe(PackageEvents.PackageUninstalled, callback);
  };

  onPackageDownloaded = (
    callback: (
      hubaiPackage: HubAIPackage,
      downloadResult: PackageDownloadResult
    ) => void
  ): void => {
    this.eventEmitter.subscribe(PackageEvents.PackageDownloaded, callback);
  };

  onPackageDownloadProgress = (
    callback: (
      hubaiPackage: HubAIPackage,
      downloadProgress: DownloadProgress
    ) => void
  ): void => {
    this.eventEmitter.subscribe(
      PackageEvents.PackageDownloadProgress,
      callback
    );
  };

  unsubscribe = (
    eventName: string,
    callback: (...args: any[]) => void
  ): void => {
    this.eventEmitter.unsubscribe(eventName, callback);
  };
}
