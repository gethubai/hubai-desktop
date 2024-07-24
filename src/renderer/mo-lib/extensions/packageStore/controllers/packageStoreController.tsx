import {
  AppContext,
  Controller,
  IEditorTab,
  INotificationItem,
  IToastService,
  component,
  localize,
} from '@hubai/core';
import React from 'react';
import { IMenuItemProps } from '@hubai/core/esm/components';
import { connect } from '@hubai/core/esm/react';
import { container } from 'tsyringe';
import { IPackageManagementService } from 'renderer/features/packages/models/managementService';
import {
  TelemetryEvents,
  type ITelemetryService,
} from 'renderer/common/telemetry';
import PackageStoreService from '../services/packageStoreService';
import { PackageStoreItem } from '../models/packageStoreItem';
import PackageView from '../views/package';
import PackageFilterService from '../services/packageFilterService';
import { PackageFilterController } from './packageFilterController';
import { FilterablePackageTree } from '../views/searchablePackageTree';
import packageStoreApi from '../httpApi';
import PackageService from '../services/packageService';
import { PackageController } from './packageController';

export class PackageStoreController extends Controller {
  private sidebarPackageLists: Record<string, PackageFilterService> = {};

  private readonly packageManagementService: IPackageManagementService;

  private readonly toastService: IToastService;

  private readonly telemetryService: ITelemetryService;

  constructor(
    private readonly appContext: AppContext,
    private readonly packageStoreService: PackageStoreService
  ) {
    super();
    this.packageManagementService =
      container.resolve<IPackageManagementService>('IPackageManagementService');
    this.toastService = container.resolve<IToastService>('IToastService');
    this.telemetryService =
      container.resolve<ITelemetryService>('ITelemetryService');
  }

  initView(): void {
    const sidebarHeaderToolbar = [
      {
        icon: 'refresh',
        id: 'packageStore.reload',
        title: localize('reload', 'Reload'),
        onClick: () => {
          if (this.packageStoreService.getState().error) {
            this.initSidebarData(); // refresh will get homepage packages
          } else {
            this.refreshPackageList(Object.keys(this.sidebarPackageLists));
          }
        },
      },
    ];

    const packagesSidebar = [
      {
        id: 'extensions',
        name: 'Extensions',
        packageType: 'extension',
        toolbar: this.getDefaultPackageListToolbar('extensions'),
      },
      {
        id: 'brains',
        name: 'Brains',
        packageType: 'brain',
        toolbar: this.getDefaultPackageListToolbar('brains'),
      },
    ] as component.ICollapseItem[];

    packagesSidebar.forEach((collapse) => {
      const service = new PackageFilterService();
      const controller = new PackageFilterController((filter) => {
        filter.packageType = collapse.packageType;
      }, service);
      const ConnectedFilterablePackageTree = connect(
        service,
        FilterablePackageTree,
        controller
      );
      controller.initView();

      this.sidebarPackageLists[collapse.id] = service;

      collapse.renderPanel = () => (
        <ConnectedFilterablePackageTree onSelectItem={this.onPackageSelect} />
      );
    });

    this.packageStoreService.setState({
      headerToolBar: sidebarHeaderToolbar,
      packageListCollapses: packagesSidebar,
    });
    this.initSidebarData();
  }

  public initSidebarData = async (): Promise<void> => {
    if (this.packageStoreService.getState().error)
      this.packageStoreService.setState({ error: undefined }); // reset the error state

    packageStoreApi
      .getHomepagePackages()
      .then((packages) => {
        Object.keys(this.sidebarPackageLists).forEach((key) => {
          this.sidebarPackageLists[key].setPackageList(packages[key]);
        });
      })
      .catch((ex) => {
        console.error('Error getting homepage packages: ', ex);
        this.packageStoreService.setState({
          error:
            'Could not fetch packages, check your connection or try again later',
        });
      });
  };

  private refreshPackageList = async (id: string | string[]) => {
    if (Array.isArray(id)) {
      id.forEach((i) => this.refreshPackageList(i));
    } else {
      this.sidebarPackageLists[id].refresh();
    }
  };

  private getDefaultPackageListToolbar = (id: string) => {
    const filterToolbar = {
      icon: 'filter',
      id: `packageList.filters.${id}`,
      title: localize('filters', 'Filters'),
      contextMenu: [
        {
          id: 'packageList.popular',
          name: 'Most Popular',
          onClick: () =>
            this.sidebarPackageLists[id].setSortBy('install_count'),
        },
        {
          id: 'packageList.recentlyPublished',
          name: 'Recently Published',
          onClick: () => this.sidebarPackageLists[id].setSortBy('publish_date'),
        },
        {
          id: 'packageList.recommended',
          name: 'Recommended',
          onClick: () => this.sidebarPackageLists[id].setSortBy('recommended'),
        },
        {
          id: 'packageList.sortByDivider',
          type: 'divider',
        },
        {
          id: 'packageList.filters.contextMenu.sortBy',
          name: 'Sort By',
          data: [
            {
              id: 'publish_date',
              name: 'Recently Published',
            },
            {
              id: 'name',
              name: 'Name',
            },
          ],
          onClick: (_, e) =>
            this.sidebarPackageLists[id].sortPackageList(e.id as any),
        },
      ] as IMenuItemProps[],
    };

    const refreshToolbar = {
      icon: 'refresh',
      id: `packageList.refresh.${id}`,
      title: localize('refresh', 'Refresh'),
      onClick: () => this.refreshPackageList(id),
    };

    return [filterToolbar, refreshToolbar];
  };

  private onPackageSelect = (item: PackageStoreItem) => {
    this.telemetryService.log(TelemetryEvents.PACKAGE_STORE_PACKAGE_SELECTED, {
      packageName: item.name,
      packageType: item.packageType,
      isInstalled: item.installed,
    });
    this.openEditorTab(item);
  };

  public openEditorTab = (item: PackageStoreItem) => {
    const tabId = `packageStore.package.${item.name}`;
    let tab: IEditorTab | undefined;

    const groupId = this.appContext.services.editor.getGroupIdByTab(tabId);
    if (groupId) {
      tab = this.appContext.services.editor.getTabById(tabId, groupId);

      if (tab) {
        this.appContext.services.editor.setActive(groupId, tabId);
        return;
      }
    }

    const service = new PackageService(item);

    const controller = new PackageController(
      service,
      this.packageManagementService,
      this.toastService
    );

    const PackageViewConnected = connect(service, PackageView, controller);
    controller.initView();

    this.appContext.services.editor.open({
      id: tabId,
      name: item?.displayName,
      icon: 'extensions',
      renderPane: () => <PackageViewConnected key={tabId} />,
      disposables: [service, controller],
    });
  };

  tryCloseEditorTab = (tabId: string) => {
    const group = this.appContext.services.editor.getState().current;
    if (group) {
      this.appContext.services.editor.closeTab(tabId, group.id!);
    }
  };

  onInstall = (item: PackageStoreItem) => {
    this.packageManagementService.installPackage(item);
  };

  onUninstall = (item: PackageStoreItem) => {
    this.packageManagementService.uninstallPackage(item);
  };

  sendNotification = (
    value: INotificationItem<any>,
    render: (item: INotificationItem<any>) => React.ReactNode
  ) => {
    this.appContext.services.notification.add([
      {
        id: `packageStore.notification.${new Date().getTime.toString()}`,
        value,
        render,
      },
    ]);

    this.appContext.services.notification.toggleNotification();
  };
}
