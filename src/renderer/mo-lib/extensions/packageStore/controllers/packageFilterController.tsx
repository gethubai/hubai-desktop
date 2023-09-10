import { Controller } from '@hubai/core';
import React from 'react';
import PackageFilterService from '../services/packageFilterService';
import packageStoreApi, { SearchPackageFilter } from '../httpApi';

export class PackageFilterController extends Controller {
  constructor(
    private readonly onBeforeSearch: (filter: SearchPackageFilter) => void,
    private readonly service: PackageFilterService
  ) {
    super();
  }

  initView(): void {
    this.service.onUpdateState((prev, next) => {
      const filtersChanged =
        prev.sortBy !== next.sortBy || prev.reloadToggle !== next.reloadToggle;

      if (filtersChanged) {
        this.onSubmit();
      }
    });
  }

  public onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.service.setSearch(event.target.value);
  };

  public onSubmit = async (): Promise<void> => {
    const filters = this.service.getFilters();
    if (this.onBeforeSearch) {
      this.onBeforeSearch(filters);
    }

    const packages = await packageStoreApi.searchPackages(filters);

    this.service.setPackageList(packages);
  };
}
