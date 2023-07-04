import 'reflect-metadata';
import { cloneDeep } from 'lodash';
import { container, injectable } from 'tsyringe';
import {
  type ISidebar,
  type ISidebarPane,
  SidebarModel,
} from '@hubai/core/esm/model/workbench/sidebar';
import { searchById } from '@hubai/core/esm/common/utils';
import type { UniqueId } from '@hubai/core/esm/common/types';
import { Component } from '@hubai/core/esm/react/component';
import { ISidebarService } from '@hubai/core';
import logger from '@hubai/core/esm/common/logger';

@injectable()
class SidebarService extends Component<ISidebar> implements ISidebarService {
  protected state: ISidebar;

  constructor() {
    super();
    this.state = container.resolve(SidebarModel);
  }

  private getPane(id: UniqueId) {
    const { panes } = this.state;
    const target = panes.find(searchById(id));
    return target;
  }

  public get(id: UniqueId) {
    const pane = this.getPane(id);
    return pane ? cloneDeep(pane) : undefined;
  }

  public add(data: ISidebarPane, isActive = false) {
    const pane = this.getPane(data.id);
    if (pane) {
      logger.error(
        `There already has a pane which id is ${data.id}, if you want to modify it, please use the update method`
      );
      return;
    }

    const oldPanes = this.state.panes.concat();
    oldPanes.push(cloneDeep(data));
    if (isActive) {
      this.setState({
        current: data.id,
      });
    }
    this.setState({
      panes: oldPanes,
    });
  }

  public update(pane: ISidebarPane) {
    const { panes } = this.state;
    const targetPane = this.getPane(pane.id);
    if (!targetPane) {
      logger.error(`There is no pane found via the ${pane.id} id`);
      return;
    }

    Object.assign(targetPane, pane);
    this.setState({
      panes: cloneDeep(panes),
    });
  }

  public remove(id: UniqueId) {
    const { panes, current } = this.state;
    const index = panes.findIndex(searchById(id));
    if (index === -1) {
      logger.error(`There is no pane found via the ${id} id`);
      return;
    }

    // If the pane is the current pane, the active next or prev pane
    if (id === current) {
      const nextCurrent = panes[index + 1]?.id || panes[index - 1]?.id || '';
      this.setActive(nextCurrent);
    }

    panes.splice(index, 1);
    this.setState({
      panes: panes.concat(),
    });
  }

  public setActive(id?: UniqueId) {
    if (!id) {
      this.setState({
        current: '',
      });
    } else {
      const pane = this.getPane(id);
      if (!pane) {
        logger.error(`There is no pane found via the ${id} id`);
        return;
      }
      this.setState({
        current: id,
      });
    }
  }

  public reset() {
    this.setState({
      panes: [],
      current: '',
    });
  }
}

export default SidebarService;
