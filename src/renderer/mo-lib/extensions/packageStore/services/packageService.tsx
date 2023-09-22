import { react } from '@hubai/core';
import { IDisposable } from '@hubai/core/esm/monaco/common';
import { PackageStoreItem } from '../models/packageStoreItem';

export type ActionButtonState = {
  text: string;
  action: () => void;
  hasCaptcha?: boolean;
  disabled?: boolean;
};

export interface PackageState {
  actionButtons: ActionButtonState[];
  item: PackageStoreItem;
  error?: string;
  captchaToken?: string;
}

export default class PackageService
  extends react.Component<PackageState>
  implements IDisposable
{
  protected state: PackageState;

  /* Name of packages that need to reload (either because it has been installed or removed recently) */
  private static readonly pendingReloadPackages: string[] = [];

  constructor(item: PackageStoreItem) {
    super();

    this.state = {
      actionButtons: [],
      item,
    };
  }

  public setPendingReload = () => {
    const { item } = this.state;
    if (!PackageService.pendingReloadPackages.includes(item.name))
      PackageService.pendingReloadPackages.push(item.name);
  };

  public isPendingReload = (): boolean => {
    const { item } = this.state;
    return PackageService.pendingReloadPackages.includes(item.name);
  };

  public setActionButton = (actionButtons: ActionButtonState[]) => {
    this.setState({ actionButtons });
  };

  dispose(): void {
    this.state = {
      actionButtons: [],
      item: {} as PackageStoreItem,
      error: undefined,
      captchaToken: undefined,
    };
  }
}
