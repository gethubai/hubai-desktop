import { Controller } from '@hubai/core';
import {
  IPackageManagementService,
  PackageEvents,
} from 'renderer/features/packages/models/managementService';
import semver from 'semver';
import { IDisposable } from '@hubai/core/esm/monaco/common';
import { HubAIPackage } from 'renderer/features/packages/models/package';
import { PackageInstallationState } from 'api-server/packages/model/packageInstallationState';
import PackageService, { ActionButtonState } from '../services/packageService';

export class PackageController extends Controller implements IDisposable {
  private buttonStates: Record<string, ActionButtonState>;

  constructor(
    private readonly packageService: PackageService,
    private readonly packageManagementService: IPackageManagementService
  ) {
    super();

    this.buttonStates = {
      install: {
        text: 'Install',
        action: this.onInstall,
        hasCaptcha: true,
      },
      update: {
        text: 'Update',
        action: this.onInstall,
        hasCaptcha: true,
      },
      uninstall: {
        text: 'Uninstall',
        action: this.onUninstall,
      },
      reload: {
        text: 'Reload',
        action: () => {
          window.electron.restart();
        },
      },
      installing: {
        text: 'Installing',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        action: () => {},
        disabled: true,
      },
    };
  }

  dispose(): void {
    this.packageManagementService.unsubscribe(
      PackageEvents.PackageInstallationStarted,
      this.onPackageInstallationStarted
    );

    this.packageManagementService.unsubscribe(
      PackageEvents.PackageInstalled,
      this.updateActionButton
    );

    this.packageManagementService.unsubscribe(
      PackageEvents.PackageUninstalled,
      this.updateActionButton
    );

    this.buttonStates = {};
  }

  initView(): void {
    this.updateActionButton();

    this.packageManagementService.onPackageInstallationStarted(
      this.onPackageInstallationStarted
    );

    this.packageManagementService.onPackageInstalled(
      this.updateActionButtonWhenInstalledPackageChanges
    );
    this.packageManagementService.onPackageUninstalled(
      this.updateActionButtonWhenInstalledPackageChanges
    );
  }

  onCaptchaToken = (token: string) => {
    this.packageService.setState({ captchaToken: token });
  };

  updateActionButtonWhenInstalledPackageChanges = (
    hubaiPackage: HubAIPackage
  ): void => {
    if (!this.isSamePackage(hubaiPackage)) {
      return;
    }
    this.updateActionButton();
  };

  updateActionButton = () => {
    const actionState = this.getActionButtonState();
    this.packageService.setActionButton(actionState);
  };

  onPackageInstallationStarted = (hubaiPackage: HubAIPackage) => {
    if (!this.isSamePackage(hubaiPackage)) return;

    this.packageService.setActionButton([this.buttonStates.installing]);
  };

  isSamePackage = (hubaiPackage: HubAIPackage): boolean => {
    const { item } = this.packageService.getState();
    return hubaiPackage.name === item.name;
  };

  getActionButtonState = (): ActionButtonState[] => {
    const { item } = this.packageService.getState();

    if (this.packageManagementService.isPendingRemovalPackage(item.name)) {
      return [this.buttonStates.reload];
    }

    const installedPackage = this.packageManagementService.getInstalledPackage(
      item.name
    );

    const list: ActionButtonState[] = [];

    if (!installedPackage) {
      list.push(this.buttonStates.install);
    } else if (
      installedPackage.installationState ===
      PackageInstallationState.pending_reload
    ) {
      list.push(this.buttonStates.reload);
    } else {
      list.push(this.buttonStates.uninstall);

      const latestPackageVersion = item.versions[0];
      if (
        semver.gt(
          latestPackageVersion.version,
          installedPackage.installedVersion!
        )
      ) {
        list.push(this.buttonStates.update);
      }
    }

    return list;
  };

  onInstall = async () => {
    const { item, captchaToken } = this.packageService.getState();

    const canUpdateOrInstall =
      this.packageManagementService.isPackageVersionCompatible(
        item.versions[0]
      );
    if (!canUpdateOrInstall.isCompatible) {
      this.setError(
        canUpdateOrInstall.incompatibilityReason ?? 'Version is not compatible'
      );
      return;
    }

    this.clearErrors();

    const result = await this.packageManagementService.installPackage(
      item,
      undefined,
      captchaToken
    );

    if (!result.success) {
      this.updateActionButton();

      this.setError(result.error!);
    }
  };

  clearErrors = (): void => {
    if (this.packageService.getState().error)
      this.packageService.setState({ error: undefined });
  };

  setError = (error: string | Error): void => {
    const errorMessage = error?.toString() ?? 'Unknown error';

    this.packageService.setState({ error: errorMessage });
  };

  onUninstall = async () => {
    const { item } = this.packageService.getState();
    this.clearErrors();

    const result = await this.packageManagementService.uninstallPackage(item);
    if (!result.success) {
      this.setError(result.error!);
    }
  };
}
