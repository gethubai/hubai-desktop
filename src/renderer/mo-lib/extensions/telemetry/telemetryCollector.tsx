import { IActivityBarService, IExtension } from '@hubai/core';
import { LocalPackage } from 'api-server/packages/model/package';
import { ITelemetryService, TelemetryEvents } from 'renderer/common/telemetry';
import { IBrainManagementService } from 'renderer/features/brain/services/brainManagement';
import { IChatClient } from 'renderer/features/chat/sdk/contracts';
import { IExtensionManagementService } from 'renderer/features/extensions/services/extensionManagement';
import { ILocalPackageManagementService } from 'renderer/features/packages/models/localPackageManagementService';
import { container } from 'tsyringe';

export class TelemetryCollectorExtension implements IExtension {
  id = 'TelemetryCollector';

  name = 'Telemetry Collector';

  telemetryService?: ITelemetryService;

  activate(): void {
    this.telemetryService =
      container.resolve<ITelemetryService>('ITelemetryService');

    window.addEventListener('error', (event) => {
      this.telemetryService?.error(TelemetryEvents.APP_ERROR, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.telemetryService?.error(TelemetryEvents.APP_UNHANDLED_REJECTION, {
        message: event.reason.message,
        stack: event.reason.stack,
      });
    });

    this.setupPackageStoreTelemetry();
    this.setupChatTelemetry();
    this.setupActivityBarTelemetry();
  }

  setupActivityBarTelemetry(): void {
    const activityBar = container.resolve<IActivityBarService>(
      'IActivityBarService'
    );

    activityBar.onChange((prev, next) => {
      this.telemetryService?.log(TelemetryEvents.ACTIVITY_BAR_CLICK, {
        id: next,
      });
    });
  }

  setupChatTelemetry(): void {
    const chatClient = container.resolve<IChatClient>('IChatClient');

    chatClient.onChatCreated((chat) => {
      this.telemetryService?.log(TelemetryEvents.CHAT_CREATED, {
        isDirect: chat.isDirect,
      });
    });
  }

  setupPackageStoreTelemetry(): void {
    const brainManagement = container.resolve<IBrainManagementService>(
      'IBrainManagementService'
    );

    const extensionManagement = container.resolve<IExtensionManagementService>(
      'IExtensionManagementService'
    );

    this.setupPackageTelemetry(brainManagement);
    this.setupPackageTelemetry(extensionManagement);
  }

  setupPackageTelemetry<TPackage extends LocalPackage>(
    service: ILocalPackageManagementService<TPackage>
  ): void {
    service.onPackageInstalled((pkg) => {
      const telemetryService =
        container.resolve<ITelemetryService>('ITelemetryService');

      telemetryService.log(TelemetryEvents.PACKAGE_INSTALL, {
        packageType: service.packageType,
        packageId: pkg.id,
        packageName: pkg.displayName,
        packageVersion: pkg.version,
      });
    });

    service.onPackageUninstalled((pkg) => {
      const telemetryService =
        container.resolve<ITelemetryService>('ITelemetryService');

      telemetryService.log(TelemetryEvents.PACKAGE_UNINSTALL, {
        packageType: service.packageType,
        packageId: pkg.id,
        packageName: pkg.displayName,
        packageVersion: pkg.version,
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose(): void {}
}

const telemetryCollectorExtension = new TelemetryCollectorExtension();
export default telemetryCollectorExtension;
