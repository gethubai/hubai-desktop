/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  react,
  Controller,
  type IActivityBarService,
  type IEditorService,
  type ISidebarService,
  IActivityBarItem,
  INotificationService,
  INotificationItem,
} from '@hubai/core';
import { container, inject, injectable } from 'tsyringe';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { openHextFileSelector } from 'renderer/common/fileUtils';
import { IMenuItemProps } from '@hubai/core/esm/components';
import { PackageUninstallationResult } from 'renderer/features/packages/models/localPackageManagementService';
import { IExtensionListController } from './type';
import { ExtensionManagementService } from '../services/extensionManagement';
import ExtensionSidebar from '../workbench/extensionSidebar';
import { ExtensionEvent, LocalExtensionViewModel } from '../models/extension';
import LocalExtensionWindow from '../workbench/localExtensionWindow';

const { connect } = react;

@injectable()
export default class ExtensionListController
  extends Controller
  implements IExtensionListController
{
  private readonly extensionService: ExtensionManagementService;

  constructor(
    @inject('ISidebarService') private sideBarService: ISidebarService,
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('IEditorService') private editorService: IEditorService,
    @inject('INotificationService')
    private notificationService: INotificationService
  ) {
    super();
    this.extensionService = container.resolve(ExtensionManagementService);
  }

  public initView(): void {
    const id = 'EXTENSIONS';
    const SideBarView = connect(this.extensionService, ExtensionSidebar, this);

    const activityBar = {
      id,
      name: 'Extensions',
      title: 'Extensions',
      icon: 'extensions',
      sortIndex: -1,
    } as IActivityBarItem;

    const groupSideBar = {
      id,
      title: 'Extensions',
      render() {
        return <SideBarView />;
      },
    };

    const sideBarHeaderToolbar = [
      {
        icon: 'add',
        id: 'addExtension',
        title: 'Add Extension',
        onClick: () => {
          return openHextFileSelector(
            this.onSelectLocalExtensionToInstall.bind(this)
          );
        },
      },
    ];

    this.extensionService.setState({
      headerToolBar: sideBarHeaderToolbar,
    });
    this.sideBarService.add(groupSideBar);
    this.activityBarService.add(activityBar);
  }

  public onExtensionClick = (extension: LocalExtensionViewModel) => {
    this.selectOrOpenExtensionWindow(extension);
  };

  public onContextMenuClick = (
    menu: IMenuItemProps,
    item: LocalExtensionViewModel
  ) => {
    switch (menu.id) {
      case 'remove':
        this.onUninstallExtension(item);
        break;
      default:
        break;
    }
  };

  private onUninstallExtension = (extension: LocalExtensionViewModel) => {
    const result = this.extensionService.uninstallPackage(extension);

    const items = [
      {
        id: generateUniqueId(),
        value: result,
        render: (item: INotificationItem<PackageUninstallationResult>) => {
          if (item.value.success) {
            return (
              <div>
                <p>{extension.displayName} uninstalled successfully!</p>
                <p>
                  <a href="#" onClick={() => window.electron.restart()}>
                    Restart&nbsp;
                  </a>
                  the application for changes to take effect
                </p>
              </div>
            );
          }

          return (
            <div>
              <p>Failed to uninstall the extension:</p>
              <p>{item.value?.error?.message ?? 'Internal error'}</p>
            </div>
          );
        },
      } as INotificationItem<PackageUninstallationResult>,
    ];
    this.notificationService.add(items);
    this.notificationService.toggleNotification();
  };

  public onSaveSettings = (
    extension: LocalExtensionViewModel,
    settings: any
  ) => {
    this.emit(ExtensionEvent.onExtensionSettingsUpdated, extension, settings);
  };

  private onSelectLocalExtensionToInstall = (file: File) => {
    // TODO: Make a usecase for this
    const res = window.electron.extension.installExtension(file.path);

    const items = [
      {
        id: generateUniqueId(),
        value: res,
        render: (item: INotificationItem) => {
          if (item.value.success) {
            return (
              <div>
                <p>
                  {item.value.extension.displayName} installed successfully!
                </p>
                <p>
                  <a href="#" onClick={() => window.electron.restart()}>
                    Restart&nbsp;
                  </a>
                  the application to use it
                </p>
              </div>
            );
          }

          return (
            <div>
              <p>Failed to install the extension:</p>
              <p>{item.value.error?.message ?? 'Internal error'}</p>
            </div>
          );
        },
      } as INotificationItem<string>,
    ];
    this.notificationService.add(items);
    this.notificationService.toggleNotification();
  };

  private async selectOrOpenExtensionWindow(
    extension: LocalExtensionViewModel
  ): Promise<void> {
    let renderPane;
    const windowId = `EXTENSION_${extension.id}`;
    if (!this.editorService.isOpened(windowId)) {
      const ViewWindow = this.createExtensionWindow(extension);
      renderPane = () => <ViewWindow key={windowId} />;
    }
    this.editorService.open({
      id: windowId,
      name: `${extension.displayName} Extension`,
      icon: 'extensions',
      renderPane,
    });
  }

  private createExtensionWindow(
    extension: LocalExtensionViewModel
  ): React.ComponentType<any> {
    // const currentSettings = this.extensionService.getExtensionSettings(extension.name);

    return connect(
      this.extensionService,
      // eslint-disable-next-line react/jsx-props-no-spreading
      (props) => (
        <LocalExtensionWindow
          extension={extension}
          getCurrentSettings={() =>
            this.extensionService.getPackageSettings(extension.name)
          }
          {...props}
        />
      ),
      this
    );
  }
}
