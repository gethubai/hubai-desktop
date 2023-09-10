/* eslint-disable max-classes-per-file */
import { react } from '@hubai/core';
import { container } from 'tsyringe';
import { IPackageManagementService } from 'renderer/features/packages/models/managementService';
import { SearchPackageFilter } from '../httpApi';
import { PackageStoreItem } from '../models/packageStoreItem';

export interface PackageFilterState {
  search?: string;
  sortBy?: string;
  data: PackageStoreItem[];
  reloadToggle: boolean;
}

export type PackageListSortBy = 'publish_date' | 'name' | 'install_count';

export default class PackageFilterService extends react.Component<PackageFilterState> {
  protected state: PackageFilterState;

  private readonly packageManagementService: IPackageManagementService;

  constructor() {
    super();
    this.state = {
      search: '',
      data: [],
      sortBy: '',
      reloadToggle: false,
    };

    this.packageManagementService =
      container.resolve<IPackageManagementService>('IPackageManagementService');
  }

  public setSortBy = (
    sortBy: 'publish_date' | 'install_count' | 'recommended'
  ) => {
    this.setState({ sortBy });
  };

  public sortPackageList = (sortBy: PackageListSortBy) => {
    const { data } = this.state;

    if (sortBy === 'publish_date')
      data.sort((a, b) => {
        return (
          new Date(b.versions[0].releaseDate).getTime() -
          new Date(a.versions[0].releaseDate).getTime()
        );
      });
    else if (sortBy === 'name')
      data.sort((a, b) => {
        return a.displayName.localeCompare(b.displayName);
      });

    this.setState({ data });
  };

  public setPackageList = (data: PackageStoreItem[]) => {
    const installedPackages =
      this.packageManagementService.getInstalledPackages();
    const newData = data.map((item) => {
      const installedPackage = installedPackages.find(
        (p) => p.name.toLowerCase() === item.name.toLowerCase()
      );
      return {
        ...item,
        installed: !!installedPackage,
      };
    });

    this.setState({ data: newData });
  };

  public refresh = () => {
    this.setState({ reloadToggle: !this.state.reloadToggle });
  };

  public setSearch = (search: string) => {
    this.setState({ search });
  };

  public getFilters = (): SearchPackageFilter => {
    return {
      search: this.state.search,
      sortBy: this.state.sortBy,
    };
  };
}
