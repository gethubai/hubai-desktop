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
import { inject, injectable } from 'tsyringe';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { openHextFileSelector } from 'renderer/common/fileUtils';
import { IMenuItemProps } from '@hubai/core/esm/components';
import { PackageUninstallationResult } from 'renderer/features/packages/models/localPackageManagementService';
import { IBrainController } from './type';
import { type IBrainManagementService } from '../services/brainManagement';
import BrainSidebar from '../workbench/brainSidebar';
import { BrainEvent, LocalBrainViewModel } from '../models/brain';
import LocalBrainWindow from '../workbench/localBrainWindow';

const { connect } = react;

@injectable()
export default class BrainController
  extends Controller
  implements IBrainController
{
  constructor(
    @inject('ISidebarService') private sideBarService: ISidebarService,
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('IEditorService') private editorService: IEditorService,
    @inject('INotificationService')
    private notificationService: INotificationService,
    @inject('IBrainManagementService')
    private brainService: IBrainManagementService
  ) {
    super();
  }

  public initView(): void {
    const id = 'BRAIN';
    const SideBarView = connect(this.brainService, BrainSidebar, this);

    const activityBar = {
      id,
      name: 'Brains',
      title: 'AI Brains',
      icon: 'octoface',
      sortIndex: -1,
    } as IActivityBarItem;

    const groupSideBar = {
      id,
      title: 'AI Brains',
      render() {
        return <SideBarView />;
      },
    };

    const sideBarHeaderToolbar = [
      {
        icon: 'add',
        id: 'addBrain',
        title: 'Add Brain',
        onClick: () => {
          return openHextFileSelector(
            this.onSelectLocalBrainToInstall.bind(this)
          );
        },
      },
    ];

    this.brainService.setState({
      headerToolBar: sideBarHeaderToolbar,
    });
    this.sideBarService.add(groupSideBar);
    this.activityBarService.add(activityBar);
  }

  public onBrainClick = (brain: LocalBrainViewModel) => {
    this.selectOrOpenBrainWindow(brain);
  };

  public onSaveSettings = (brain: LocalBrainViewModel, settings: any) => {
    this.emit(BrainEvent.onBrainSettingsUpdated, brain, settings);
  };

  public onContextMenuClick = (
    menu: IMenuItemProps,
    item: LocalBrainViewModel
  ) => {
    switch (menu.id) {
      case 'remove':
        this.onUninstall(item);
        break;
      default:
        break;
    }
  };

  private onUninstall = (pack: LocalBrainViewModel) => {
    const result = this.brainService.uninstallPackage(pack);

    const items = [
      {
        id: generateUniqueId(),
        value: result,
        render: (item: INotificationItem<PackageUninstallationResult>) => {
          if (item.value.success) {
            return (
              <div>
                <p>{pack.displayName} uninstalled successfully!</p>
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
              <p>Failed to uninstall the brain:</p>
              <p>{item.value?.error?.message ?? 'Internal error'}</p>
            </div>
          );
        },
      } as INotificationItem<PackageUninstallationResult>,
    ];
    this.notificationService.add(items);
    this.notificationService.toggleNotification();
  };

  private onSelectLocalBrainToInstall = (file: File) => {
    const res = this.brainService.installPackage(file.path);

    const items = [
      {
        id: generateUniqueId(),
        value: res,
        render: (item: INotificationItem) => {
          if (item.value.success) {
            return (
              <div>
                <p>{item.value.result.displayName} installed successfully!</p>
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
              <p>Failed to install the brain:</p>
              <p>{item.value.error?.message ?? 'Internal error'}</p>
            </div>
          );
        },
      } as INotificationItem<any>,
    ];
    this.notificationService.add(items);
    this.notificationService.toggleNotification();
  };

  private async selectOrOpenBrainWindow(
    brain: LocalBrainViewModel
  ): Promise<void> {
    let renderPane;
    const windowId = `BRAIN_${brain.id}`;
    if (!this.editorService.isOpened(windowId)) {
      const ViewWindow = this.createBrainWindow(brain);
      renderPane = () => <ViewWindow key={windowId} />;
    }
    this.editorService.open({
      id: windowId,
      name: `${brain.displayName} Brain`,
      icon: 'octoface',
      renderPane,
    });
  }

  private createBrainWindow(
    brain: LocalBrainViewModel
  ): React.ComponentType<any> {
    // const currentSettings = this.brainService.getBrainSettings(brain.name);

    return connect(
      this.brainService,
      // eslint-disable-next-line react/jsx-props-no-spreading
      (props) => (
        <LocalBrainWindow
          brain={brain}
          getCurrentSettings={() =>
            this.brainService.getBrainSettings(brain.id)
          }
          {...props}
        />
      ),
      this
    );
  }
}
