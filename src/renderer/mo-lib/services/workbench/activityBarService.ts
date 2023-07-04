import 'reflect-metadata';
import { container, inject, injectable } from 'tsyringe';
import { Component } from '@hubai/core/esm/react/component';
import { searchById } from '@hubai/core/esm/common/utils';
import logger from '@hubai/core/esm/common/logger';
import type { UniqueId } from '@hubai/core/esm/common/types';
import {
  IActivityBarService,
  type ISidebarService,
  IActivityMenuItemProps,
  ActivityBarModel,
  ActivityBarEvent,
  IActivityBar,
  IActivityBarItem,
} from '@hubai/core';

@injectable()
class ActivityBarService
  extends Component<IActivityBar>
  implements IActivityBarService
{
  protected state: IActivityBar;

  constructor(
    @inject('ISidebarService') private sidebarService: ISidebarService
  ) {
    super();
    this.state = container.resolve(ActivityBarModel);
  }

  public setActive(id?: UniqueId) {
    this.setState({
      selected: id,
    });
  }

  private getRemoveList<T extends IActivityBarItem | IActivityMenuItemProps>(
    id: UniqueId | UniqueId[],
    data: T[]
  ) {
    return data.reduce((total: number[], item: T, key: number) => {
      const strItem = item.id.toString();
      if ((Array.isArray(id) && id.includes(strItem)) || id === strItem) {
        return total.concat(key);
      }
      return total;
    }, []);
  }

  public add(data: IActivityBarItem | IActivityBarItem[], isActive = false) {
    let next = [...this.state.data!];
    if (Array.isArray(data)) {
      next = next?.concat(data);
    } else {
      next?.push(data);
      if (isActive) {
        this.setActive(data.id);
      }
    }

    // The smaller the sort number is, the more front the order is
    next.sort((pre, next) => {
      const preIndex = pre.sortIndex || Number.MAX_SAFE_INTEGER;
      const nextIndex = next.sortIndex || Number.MAX_SAFE_INTEGER;
      return preIndex - nextIndex;
    });

    this.setState({
      data: next,
    });
  }

  public reset() {
    this.setState({
      data: [],
      selected: '',
      contextMenu: [],
    });
  }

  public remove(id: UniqueId | UniqueId[]) {
    const { data } = this.state;
    let next = [...data!];
    const indexs = this.getRemoveList<IActivityBarItem>(id, next);

    if (!indexs.length) {
      logger.error(
        "Remove the bar data failed, because there is no data found in barData via this 'id'"
      );
    } else {
      next = next.filter((_, key) => {
        return !indexs.includes(key);
      });

      this.setState({
        data: next,
      });
    }
  }

  public toggleBar(id: UniqueId) {
    const { data = [], selected } = this.state;
    const next = data.concat();
    const index = next.findIndex(searchById(id));
    const target = next[index];

    if (target) {
      target.hidden = !target.hidden;
      if (id === selected) {
        const nextIndex = (index + 1) % next.length;
        this.setActive(next[nextIndex].id);
        this.sidebarService.setActive(next[nextIndex].id);
      }
      this.setState({
        data: next,
      });
    } else {
      logger.error('Toggle activity bar failed, please check your id');
    }
  }

  public toggleContextMenuChecked(id: UniqueId) {
    const { contextMenu = [] } = this.state;
    const newActions = contextMenu.concat();
    const target = newActions.find(searchById(id));

    if (target) {
      target.icon = target.icon === 'check' ? '' : 'check';
      this.setState({
        contextMenu: newActions,
      });
    } else {
      logger.error(
        `Toggle the contextmenu failed, can not found any menu by id ${id}`
      );
    }
  }

  public addContextMenu(
    contextMenu: IActivityMenuItemProps | IActivityMenuItemProps[]
  ) {
    let next = [...this.state.contextMenu!];

    if (Array.isArray(contextMenu)) {
      next = next?.concat(contextMenu);
    } else {
      next?.push(contextMenu);
    }
    this.setState({
      contextMenu: next,
    });
  }

  public removeContextMenu(id: UniqueId | UniqueId[]) {
    const { contextMenu } = this.state;
    let next = [...contextMenu!];
    const indexs = this.getRemoveList<IActivityMenuItemProps>(id, next);

    if (!indexs.length) {
      logger.error(
        "Remove the bar data failed, because there is no data found in barData via this 'id'"
      );
    } else {
      next = next.filter((_, key) => {
        return !indexs.includes(key);
      });
      this.setState({
        contextMenu: next,
      });
    }
  }

  // ====== The belows for subscribe activity bar events ======
  public onClick(
    callback: (selectedKey: UniqueId, item: IActivityBarItem) => void
  ) {
    this.subscribe(ActivityBarEvent.OnClick, callback);
  }

  public onChange(
    callback: (prevSelectedKey?: UniqueId, nextSelectedKey?: UniqueId) => void
  ) {
    this.subscribe(ActivityBarEvent.OnChange, callback);
  }
}

export default ActivityBarService;
