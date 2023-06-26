import React from 'react';
import {
  react,
  Controller,
  type IActivityBarService,
  type IEditorService,
  type ISidebarService,
  IActivityBarItem,
} from '@allai/core';
import { container, inject, injectable } from 'tsyringe';
import { IBrainController } from './type';
import { BrainManagementService } from '../services/brainManagement';
import BrainSidebar from '../workbench/brainSidebar';
import { BrainEvent, LocalBrainViewModel } from '../models/brain';
import LocalBrainWindow from '../workbench/localBrainWindow';

const { connect } = react;

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
    @inject('IEditorService') private editorService: IEditorService
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
        onClick: () => console.log('not implemented!'),
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
