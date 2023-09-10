import { component } from '@hubai/core';
import { PackageStoreItem } from './packageStoreItem';

export interface IPackageTypePackages {
  [key: string]: PackageStoreItem[];
}

export interface PackageStoreState {
  headerToolBar?: component.IActionBarItemProps[];
  packageListCollapses?: component.ICollapseItem[];
  error?: string;
}
