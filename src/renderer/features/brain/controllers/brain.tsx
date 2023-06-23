import React from 'react';
import { Controller, connect } from 'mo/react';
import { container, singleton } from 'tsyringe';
import {
  ActivityBarService,
  EditorService,
  IActivityBarService,
  IEditorService,
  ISidebarService,
  SidebarService,
} from 'mo/services';
import { IActivityBarItem } from 'mo/model';
import { IBrainController } from './type';
import { BrainManagementService } from '../services/brainManagement';
import BrainSidebar from '../workbench/brainSidebar';
import { BrainEvent, LocalBrainViewModel } from '../models/brain';
import LocalBrainWindow from '../workbench/localBrainWindow';

@singleton()
export default class BrainController
  extends Controller
  implements IBrainController
{
  private readonly sideBarService: ISidebarService;

  private readonly activityBarService: IActivityBarService;

  private readonly editorService: IEditorService;

  private readonly brainService: BrainManagementService;

  constructor() {
    super();

    this.sideBarService = container.resolve(SidebarService);
    this.activityBarService = container.resolve(ActivityBarService);
    this.editorService = container.resolve(EditorService);
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
