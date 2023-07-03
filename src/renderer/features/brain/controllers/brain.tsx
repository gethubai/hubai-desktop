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
} from '@allai/core';
import { container, inject, injectable } from 'tsyringe';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { IBrainController } from './type';
import { BrainManagementService } from '../services/brainManagement';
import BrainSidebar from '../workbench/brainSidebar';
import { BrainEvent, LocalBrainViewModel } from '../models/brain';
import LocalBrainWindow from '../workbench/localBrainWindow';

const { connect } = react;

function openFileSelector(onSelect: any) {
  // create the file input dynamically
  const fileInput = document.createElement('input');

  // set the attributes
  fileInput.setAttribute('type', 'file');
  fileInput.setAttribute('accept', '.zip'); // accept only zip files
  fileInput.setAttribute('multiple', 'false'); // accept only one file

  // register the change event to capture the selected files
  fileInput.addEventListener('change', function () {
    const { files } = fileInput;
    // perform the operation you want on the selected files
    // e.g., print the name of the first selected file
    if (files && files.length > 0) {
      onSelect(files[0]);
    }
  });

  // programmatically trigger the click event
  fileInput.click();
}

@injectable()
export default class BrainController
  extends Controller
  implements IBrainController
{
  private readonly brainService: BrainManagementService;

  constructor(
    @inject('ISidebarService') private sideBarService: ISidebarService,
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('IEditorService') private editorService: IEditorService,
    @inject('INotificationService')
    private notificationService: INotificationService
  ) {
    super();
    this.brainService = container.resolve(BrainManagementService);
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
          return openFileSelector(this.onSelectLocalBrainToInstall.bind(this));
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

  private onSelectLocalBrainToInstall = (file: File) => {
    const res = window.electron.brain.installBrain(file.path);

    const items = [
      {
        id: generateUniqueId(),
        value: res,
        render: (item: INotificationItem) => {
          if (item.value.success) {
            return (
              <div>
                <p>{item.value.brain.title} installed successfully!</p>
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
      } as INotificationItem<string>,
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
      renderPane = () => <ViewWindow />;
    }
    this.editorService.open({
      id: windowId,
      name: `${brain.title} Brain`,
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
            this.brainService.getBrainSettings(brain.name)
          }
          {...props}
        />
      ),
      this
    );
  }
}
