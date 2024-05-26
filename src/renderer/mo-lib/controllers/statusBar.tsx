import React from 'react';
import { Controller } from '@hubai/core/esm/react/controller';
import { IMenuItemProps } from '@hubai/core/esm/components/menu';
import { inject, injectable } from 'tsyringe';
import {
  type IStatusBarService,
  IStatusBarItem,
  StatusBarEvent,
} from '@hubai/core';
import { EditorStatusBarView } from 'mo/workbench/editor';
import { cloneDeep } from 'lodash';
import { type IBuiltinService } from 'mo/services/builtinService';
import { type IMenuBarController } from './menuBar';

export interface IStatusBarController extends Partial<Controller> {
  onClick?: (e: React.MouseEvent, item: IStatusBarItem) => void;
  onContextMenuClick?: (
    e: React.MouseEvent,
    item: IMenuItemProps | undefined
  ) => void;
}

@injectable()
class StatusBarController extends Controller implements IStatusBarController {
  constructor(
    @inject('IStatusBarService') private statusBarService: IStatusBarService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('IMenuBarController') private menuBarController: IMenuBarController
  ) {
    super();
  }

  public initView() {
    const { STATUS_EDITOR_INFO, CONTEXT_MENU_HIDE_STATUS_BAR } =
      this.builtinService.getModules();

    const nextRightItems = cloneDeep(
      this.statusBarService.getState().rightItems
    );
    const nextContextMenu = cloneDeep(
      this.statusBarService.getState().contextMenu || []
    );
    if (STATUS_EDITOR_INFO) {
      nextRightItems.push({
        ...STATUS_EDITOR_INFO,
        render: (item: IStatusBarItem) => <EditorStatusBarView {...item} />,
      });
    }

    if (CONTEXT_MENU_HIDE_STATUS_BAR) {
      nextContextMenu.push(CONTEXT_MENU_HIDE_STATUS_BAR);
    }
    this.statusBarService.setState({
      rightItems: nextRightItems,
      contextMenu: nextContextMenu,
    });
  }

  public onClick = (e: React.MouseEvent, item: IStatusBarItem) => {
    this.emit(StatusBarEvent.onClick, e, item);
  };

  public readonly onContextMenuClick = (
    e: React.MouseEvent,
    item: IMenuItemProps | undefined
  ) => {
    const menuId = item?.id;
    const { STATUS_BAR_HIDE_ID } = this.builtinService.getConstants();
    switch (menuId) {
      case STATUS_BAR_HIDE_ID:
        this.menuBarController.updateStatusBar?.();
        break;
      default:
        break;
    }
  };
}

export default StatusBarController;
