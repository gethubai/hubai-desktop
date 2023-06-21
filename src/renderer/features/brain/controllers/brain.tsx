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
import { LocalBrainViewModel } from '../models/brain';

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
    console.log('clicked on brain', brain);
  };
}
