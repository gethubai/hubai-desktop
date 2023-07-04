import React from 'react';
import { inject, injectable } from 'tsyringe';
import { IMenuItemProps } from '@hubai/core/esm/components/menu';
import {
  ActivityBarEvent,
  IActivityBarItem,
  Controller,
  type IActivityBarService,
  type IBuiltinService,
  type ISettingsService,
} from '@hubai/core';
import { type IMonacoService } from '@hubai/core/esm/monaco/monacoService';
import type { UniqueId } from '@hubai/core/esm/common/types';
import { CommandQuickAccessViewAction } from 'mo/monaco/quickAccessViewAction';
import { SelectColorThemeAction } from 'mo/monaco/selectColorThemeAction';
import { type IMenuBarController } from './menuBar';

export interface IActivityBarController extends Partial<Controller> {
  /**
   * Called when activity bar item is clicked
   */
  onClick?: (selectedKey: UniqueId, selectedNode: IActivityBarItem) => void;
  /**
   * Called when activity bar item which is not global is changed
   */
  onChange?: (prevSelected?: UniqueId, nextSelected?: UniqueId) => void;
  onContextMenuClick?: (
    e: React.MouseEvent,
    item: IMenuItemProps | undefined
  ) => void;
}

@injectable()
class ActivityBarController
  extends Controller
  implements IActivityBarController
{
  constructor(
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('ISettingsService') private settingsService: ISettingsService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('IMenuBarController') private menuBarController: IMenuBarController,
    @inject('IMonacoService') private monacoService: IMonacoService
  ) {
    super();
  }

  public initView() {
    const { activityBarData, contextMenuData } =
      this.builtinService.getModules();
    if (activityBarData) {
      this.activityBarService.add(activityBarData);
    }
    if (contextMenuData) {
      this.activityBarService.addContextMenu(contextMenuData);
    }
  }

  public readonly onClick = (
    selectedKey: UniqueId,
    selctedNode: IActivityBarItem
  ) => {
    this.emit(ActivityBarEvent.OnClick, selectedKey, selctedNode);
  };

  public readonly onChange = (
    prevSelected?: UniqueId,
    nextSelected?: UniqueId
  ) => {
    this.emit(ActivityBarEvent.OnChange, prevSelected, nextSelected);
  };

  private gotoQuickCommand() {
    this.monacoService.commandService.executeCommand(
      CommandQuickAccessViewAction.ID
    );
  }

  private onSelectColorTheme = () => {
    this.monacoService.commandService.executeCommand(SelectColorThemeAction.ID);
  };

  public readonly onContextMenuClick = (
    e: React.MouseEvent,
    item: IMenuItemProps | undefined
  ) => {
    const contextMenuId = item?.id;
    const {
      ACTION_QUICK_COMMAND = '',
      ACTION_QUICK_ACCESS_SETTINGS = '',
      ACTION_SELECT_THEME = '',
      CONTEXT_MENU_MENU = '',
      CONTEXT_MENU_EXPLORER = '',
      CONTEXT_MENU_SEARCH = '',
      CONTEXT_MENU_HIDE,
    } = this.builtinService.getConstants();
    switch (contextMenuId) {
      // activityBar contextMenu
      case CONTEXT_MENU_MENU: {
        this.menuBarController.updateMenuBar!();
        this.activityBarService.toggleContextMenuChecked(contextMenuId);
        break;
      }
      case CONTEXT_MENU_EXPLORER:
      case CONTEXT_MENU_SEARCH: {
        this.activityBarService.toggleBar(contextMenuId);
        this.activityBarService.toggleContextMenuChecked(contextMenuId);
        break;
      }
      case CONTEXT_MENU_HIDE: {
        this.menuBarController.updateActivityBar!();
        break;
      }
      // manage button contextMenu
      case ACTION_QUICK_COMMAND: {
        this.gotoQuickCommand();
        break;
      }
      case ACTION_QUICK_ACCESS_SETTINGS: {
        this.settingsService.openSettingsInEditor();
        break;
      }
      case ACTION_SELECT_THEME: {
        this.onSelectColorTheme();
        break;
      }
      default: {
        break;
      }
    }
  };
}
export default ActivityBarController;
