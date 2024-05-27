import { container, injectable } from 'tsyringe';
import cloneDeep from 'lodash/cloneDeep';
import { Component } from '@hubai/core/esm/react/component';
import { IMenuItemProps } from '@hubai/core/esm/components/menu';
import { searchById } from '@hubai/core/esm/common/utils';
import { IActionBarItemProps } from '@hubai/core/esm/components';
import logger from '@hubai/core/esm/common/logger';
import type { UniqueId } from '@hubai/core/esm/common/types';
import {
  IExplorerService,
  IExplorerPanelItem,
  IExplorer,
  IExplorerModel,
  ExplorerEvent,
} from '@hubai/core';

@injectable()
class ExplorerService extends Component<IExplorer> implements IExplorerService {
  protected state: IExplorer;

  constructor() {
    super();
    this.state = container.resolve(IExplorerModel);
  }

  public setExpandedPanels(activePanelKeys: UniqueId[]) {
    this.setState({
      activePanelKeys,
    });
  }

  private toggleIcon(icon?: string) {
    return icon === 'check' ? '' : 'check';
  }

  public getAction(id: UniqueId): IMenuItemProps | undefined {
    const { headerToolBar } = this.state;
    const action = headerToolBar?.contextMenu?.find(searchById(id));
    return action ? cloneDeep(action) : action;
  }

  public updatePanel(data: Partial<IExplorerPanelItem>) {
    if (!data.id) {
      logger.error('Must provide id property in update data');
      return;
    }
    const next = this.state.data.concat();
    const target = next.find(searchById(data.id));
    if (!target) {
      logger.error(`There is no panel found in state whose id is ${data.id}`);
      return;
    }

    Object.assign(target, data);

    this.setState({
      data: next,
    });

    this.updateAction({
      id: data.id.toString(),
      name: data.name,
      title: data.title,
      sortIndex: data.sortIndex,
    });
  }

  public updateAction(action: Partial<IMenuItemProps>) {
    if (!action.id) {
      logger.error('Must provide id property in action data');
      return;
    }
    const { headerToolBar } = this.state;
    if (!headerToolBar) {
      logger.error(
        "Molecule can' update the action, because there is no headerToolBar in Explorer"
      );
      return;
    }
    const nextActions = headerToolBar.contextMenu?.concat() || [];

    const target = nextActions.find(searchById(action.id));
    if (!target) {
      logger.error(
        `There is no action found in actions whose id is ${action.id}`
      );
      return;
    }

    Object.assign(target, action);

    this.setState({
      headerToolBar: {
        ...headerToolBar,
        contextMenu: nextActions,
      },
    });
  }

  public addPanel(data: IExplorerPanelItem | IExplorerPanelItem[]) {
    const workInProgressData = Array.isArray(data) ? data : [data];
    const next = [...this.state.data!];
    const nextActions: IMenuItemProps[] = [];
    workInProgressData.forEach((item) => {
      const index = next.findIndex(searchById(item.id));
      if (index !== -1) {
        logger.error(`There is already a panel whose id is ${item.id}`);
      } else {
        next.push(cloneDeep(item));
        nextActions.push({
          id: item.id.toString(),
          name: item.name,
          title: item.name,
          icon: 'check',
          sortIndex: item.sortIndex,
        });
      }
    });

    // sort by sortIndex
    next.sort(
      ({ sortIndex: preIndex = 0 }, { sortIndex: nextIndex = 0 }) =>
        nextIndex - preIndex
    );

    this.setState({
      data: next,
    });
    // async add header actions
    this.addAction(nextActions);
  }

  public addAction(action: IMenuItemProps | IMenuItemProps[]) {
    const workInProgressActions = Array.isArray(action) ? action : [action];
    const { headerToolBar } = this.state;
    if (!headerToolBar) {
      logger.error(
        "Molecule can't add the action, because there is no headerToolBar in Explorer"
      );
      return;
    }
    const newActions = headerToolBar.contextMenu?.concat() || [];
    // eslint-disable-next-line @typescript-eslint/no-shadow
    workInProgressActions.forEach((action) => {
      const index = newActions.findIndex(searchById(action.id));
      if (index !== -1) {
        logger.error(`There is already an action whose id is ${action.id}`);
      } else {
        newActions.push(action);
      }
    });

    // sort by sortIndex
    newActions.sort(
      ({ sortIndex: preIndex = 0 }, { sortIndex: nextIndex = 0 }) =>
        nextIndex - preIndex
    );
    const next = { ...headerToolBar, contextMenu: newActions };
    this.setState({
      headerToolBar: next,
    });
  }

  public removePanel(id: UniqueId) {
    const { data } = this.state;
    const next = [...data!];
    const index = next.findIndex(searchById(id));
    if (index > -1) {
      next.splice(index, 1);
    }
    this.setState({
      data: next,
    });

    // async remove action
    this.removeAction(id);
  }

  public removeAction(id: UniqueId) {
    const { headerToolBar } = this.state;
    if (!headerToolBar) {
      logger.error(
        "Molecule can' remove the action, because there is no headerToolBar in Explorer"
      );
      return;
    }
    const newActions = headerToolBar.contextMenu || [];
    const index = newActions?.findIndex(searchById(id));
    if (index > -1) {
      newActions.splice(index, 1);
    }
    const next = { ...headerToolBar, contextMenu: newActions };
    this.setState({
      headerToolBar: next,
    });
  }

  // update panel hidden
  public togglePanel(id: UniqueId) {
    const { data } = this.state;
    const next = data.concat();
    // find current panel
    const currentPanel = next.find(searchById(id));
    if (currentPanel) {
      currentPanel.hidden = !currentPanel.hidden;
      this.setState({
        data: next,
      });
      // async update toolbar status
      this.toggleHeaderBar(id);
    }
  }

  // update header toolbar status
  public toggleHeaderBar(id: UniqueId) {
    const { headerToolBar } = this.state;
    if (!headerToolBar) {
      logger.error(
        "Molecule can' toggle the header bar, because there is no headerToolBar in Explorer"
      );
      return;
    }
    const nextMenu = headerToolBar.contextMenu?.concat() || [];
    const currentMenu = nextMenu.find(searchById(id));
    if (currentMenu) {
      currentMenu.icon = this.toggleIcon(currentMenu.icon as string);
      const next = {
        ...headerToolBar,
        contextMenu: nextMenu,
      };
      this.setState({
        headerToolBar: next,
      });
    }
  }

  public reset() {
    this.setState({
      data: [],
      headerToolBar: undefined,
    });
  }

  public onClick(callback: (e: MouseEvent, item: IActionBarItemProps) => void) {
    this.subscribe(ExplorerEvent.onClick, callback);
  }

  public onRemovePanel(callback: (panel: IExplorerPanelItem) => void) {
    this.subscribe(ExplorerEvent.onRemovePanel, callback);
  }

  public onCollapseAllFolders(callback: () => void) {
    this.subscribe(ExplorerEvent.onCollapseAllFolders, callback);
  }

  public onPanelToolbarClick(
    callback: (panel: IExplorerPanelItem, toolbarId: string) => void
  ) {
    this.subscribe(ExplorerEvent.onPanelToolbarClick, callback);
  }
}

export default ExplorerService;
