import React from 'react';
import { inject, injectable } from 'tsyringe';
import { MenuBarEvent } from '@hubai/core/esm/model/workbench/menuBar';
import { MenuBarMode } from '@hubai/core/esm/model/workbench/layout';
import {
  type IMenuBarService,
  type ILayoutService,
  type IActivityBarService,
  IActivityBarItem,
  IMenuBarItem,
  Controller,
} from '@hubai/core';
import { ID_APP, ID_SIDE_BAR } from '@hubai/core/esm/common/id';
import { type IMonacoService } from '@hubai/core/esm/monaco/monacoService';
import type { UniqueId } from '@hubai/core/esm/common/types';
import { CommandQuickSideBarViewAction } from 'mo/monaco/quickToggleSideBarAction';
import { QuickTogglePanelAction } from 'mo/monaco/quickTogglePanelAction';
import { type IBuiltinService } from 'mo/services/builtinService';

export interface IMenuBarController extends Partial<Controller> {
  onSelect?: (key: UniqueId, item?: IActivityBarItem) => void;
  onClick: (event: React.MouseEvent<any, any>, item: IMenuBarItem) => void;
  updateFocusinEle?: (ele: HTMLElement | null) => void;
  updateStatusBar?: () => void;
  updateMenuBar?: () => void;
  updateActivityBar?: () => void;
  updateSideBar?: () => void;
  updateMenuBarMode?: (mode: keyof typeof MenuBarMode) => void;
  getMenuBarDataByMode?: (
    mode: keyof typeof MenuBarMode,
    menuData: IMenuBarItem[]
  ) => IMenuBarItem[];
}

@injectable()
export class MenuBarController
  extends Controller
  implements IMenuBarController
{
  private _focusinEle: HTMLElement | null = null;

  private _automation: Record<string, () => void> = {};

  constructor(
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('ILayoutService') private layoutService: ILayoutService,
    @inject('IMenuBarService') private menuBarService: IMenuBarService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('IMonacoService') private monacoService: IMonacoService
  ) {
    super();
  }

  public initView() {
    const { builtInMenuBarData } = this.builtinService.getModules();
    const {
      ACTION_QUICK_CREATE_FILE,
      ACTION_QUICK_UNDO,
      ACTION_QUICK_REDO,
      ACTION_QUICK_SELECT_ALL,
      ACTION_QUICK_COPY_LINE_UP,
      MENU_VIEW_ACTIVITYBAR,
      MENU_VIEW_AUXILIARY,
      MENU_VIEW_MENUBAR,
      MENU_VIEW_STATUSBAR,
      MENU_QUICK_COMMAND,
      MENU_VIEW_PANEL,
      MENUBAR_MODE_HORIZONTAL,
      MENUBAR_MODE_VERTICAL,
    } = this.builtinService.getConstants();
    if (builtInMenuBarData) {
      const mode = this.layoutService.getMenuBarMode();
      const menuBarData = this.getMenuBarDataByMode(mode, builtInMenuBarData);
      this.menuBarService.setMenus(menuBarData);
    }
    (
      [
        [ACTION_QUICK_CREATE_FILE, () => this.createFile()],
        [ACTION_QUICK_UNDO, () => this.undo()],
        [ACTION_QUICK_REDO, () => this.redo()],
        [ACTION_QUICK_SELECT_ALL, () => this.selectAll()],
        [ACTION_QUICK_COPY_LINE_UP, () => this.copyLineUp()],
        [MENU_VIEW_ACTIVITYBAR, () => this.updateActivityBar()],
        [MENU_VIEW_MENUBAR, () => this.updateMenuBar()],
        [MENU_VIEW_STATUSBAR, () => this.updateStatusBar()],
        [MENU_QUICK_COMMAND, () => this.gotoQuickCommand()],
        [ID_SIDE_BAR, () => this.updateSideBar()],
        [MENU_VIEW_AUXILIARY, () => this.updateAuxiliaryBar()],
        [MENU_VIEW_PANEL, () => this.updatePanel()],
        [
          MENUBAR_MODE_HORIZONTAL,
          () => this.updateMenuBarMode(MenuBarMode.horizontal),
        ],
        [
          MENUBAR_MODE_VERTICAL,
          () => this.updateMenuBarMode(MenuBarMode.vertical),
        ],
      ] as [string, () => void][]
    ).forEach(([key, value]) => {
      if (key) {
        this._automation[key] = value;
      }
    });

    this.subscribe(MenuBarEvent.onChangeMode, this.updateMenuBarDataByMode);
  }

  public updateFocusinEle = (ele: HTMLElement | null) => {
    if (ele?.id === ID_APP) return;
    this._focusinEle = ele;
  };

  public readonly onClick = (event: React.MouseEvent, item: IMenuBarItem) => {
    const menuId = item.id || '';

    this.emit(MenuBarEvent.onSelect, menuId);
    this._automation[menuId]?.();

    // Update the check status of MenuBar in the contextmenu of ActivityBar
    this.updateActivityBarContextMenu(menuId);
  };

  public createFile = () => {
    const { ACTION_QUICK_CREATE_FILE } = this.builtinService.getConstants();
    if (ACTION_QUICK_CREATE_FILE) {
      this.monacoService.commandService.executeCommand(
        ACTION_QUICK_CREATE_FILE
      );
    }
  };

  public undo = () => {
    const { ACTION_QUICK_UNDO } = this.builtinService.getConstants();
    if (ACTION_QUICK_UNDO) {
      this.monacoService.commandService.executeCommand(
        ACTION_QUICK_UNDO,
        this._focusinEle
      );
    }
  };

  public redo = () => {
    const { ACTION_QUICK_REDO } = this.builtinService.getConstants();
    if (ACTION_QUICK_REDO) {
      this.monacoService.commandService.executeCommand(
        ACTION_QUICK_REDO,
        this._focusinEle
      );
    }
  };

  public gotoQuickCommand = () => {
    const { ACTION_QUICK_COMMAND } = this.builtinService.getConstants();
    if (ACTION_QUICK_COMMAND) {
      this.monacoService.commandService.executeCommand(ACTION_QUICK_COMMAND);
    }
  };

  public updateActivityBar = () => {
    const hidden = this.layoutService.toggleActivityBarVisibility();
    const { MENU_VIEW_ACTIVITYBAR } = this.builtinService.getConstants();
    if (MENU_VIEW_ACTIVITYBAR) {
      this.menuBarService.update(MENU_VIEW_ACTIVITYBAR, {
        icon: hidden ? '' : 'check',
      });
    }
  };

  public selectAll = () => {
    const { ACTION_QUICK_SELECT_ALL } = this.builtinService.getConstants();
    if (ACTION_QUICK_SELECT_ALL) {
      this.monacoService.commandService.executeCommand(
        ACTION_QUICK_SELECT_ALL,
        this._focusinEle
      );
    }
  };

  public copyLineUp = () => {
    const { ACTION_QUICK_COPY_LINE_UP } = this.builtinService.getConstants();
    if (ACTION_QUICK_COPY_LINE_UP) {
      this.monacoService.commandService.executeCommand(
        ACTION_QUICK_COPY_LINE_UP
      );
    }
  };

  public updateMenuBar = () => {
    const hidden = this.layoutService.toggleMenuBarVisibility();
    const { MENU_VIEW_MENUBAR } = this.builtinService.getConstants();
    if (MENU_VIEW_MENUBAR) {
      this.menuBarService.update(MENU_VIEW_MENUBAR, {
        icon: hidden ? '' : 'check',
      });
    }
  };

  public updateMenuBarMode = (mode: keyof typeof MenuBarMode) => {
    this.layoutService.setMenuBarMode(mode);
  };

  private updateMenuBarDataByMode = (mode: keyof typeof MenuBarMode) => {
    const { builtInMenuBarData } = this.builtinService.getModules();
    const {
      MENUBAR_MODE_HORIZONTAL,
      MENUBAR_MODE_VERTICAL,
      MENU_APPEARANCE_ID,
    } = this.builtinService.getConstants();
    let removeKey = MENUBAR_MODE_HORIZONTAL;
    let appendKey = MENUBAR_MODE_VERTICAL;

    if (mode === MenuBarMode.vertical) {
      removeKey = MENUBAR_MODE_VERTICAL;
      appendKey = MENUBAR_MODE_HORIZONTAL;
    }

    const menuItem = this.getMenuBarItem(builtInMenuBarData, appendKey!);
    this.menuBarService.remove(removeKey!);
    this.menuBarService.append(menuItem!, MENU_APPEARANCE_ID!);
  };

  private getMenuBarItem = (
    data: IMenuBarItem[],
    id: string
  ): IMenuBarItem | null => {
    Array.from(data).some((item) => {
      if (item.id === id) {
        return { ...item };
      }

      if (Array.isArray(item.data) && item.data.length > 0) {
        const itemData = this.getMenuBarItem(item.data, id);
        if (itemData) {
          return itemData;
        }
      }

      return null;
    });

    return null;
  };

  public updateStatusBar = () => {
    const hidden = this.layoutService.toggleStatusBarVisibility();
    const { MENU_VIEW_STATUSBAR } = this.builtinService.getConstants();
    if (MENU_VIEW_STATUSBAR) {
      this.menuBarService.update(MENU_VIEW_STATUSBAR, {
        icon: hidden ? '' : 'check',
      });
    }
  };

  public updateSideBar = () => {
    this.monacoService.commandService.executeCommand(
      CommandQuickSideBarViewAction.ID
    );
  };

  public updateAuxiliaryBar = () => {
    const nextHidden = this.layoutService.setAuxiliaryBar((hidden) => !hidden);

    const { MENU_VIEW_AUXILIARY } = this.builtinService.getConstants();
    if (MENU_VIEW_AUXILIARY) {
      this.menuBarService.update(MENU_VIEW_AUXILIARY, {
        icon: nextHidden ? '' : 'check',
      });
    }
  };

  private updatePanel = () => {
    this.monacoService.commandService.executeCommand(QuickTogglePanelAction.ID);
  };

  /**
   * Get the menu bar data after filtering out the menu contained in ids
   * @param menuData
   * @param ids
   * @returns Filtered menu bar data
   */
  private getFilteredMenuBarData(
    menuData: IMenuBarItem[],
    ids: (UniqueId | undefined)[]
  ): IMenuBarItem[] {
    const newData: IMenuBarItem[] = [];
    if (Array.isArray(menuData)) {
      menuData.forEach((item: IMenuBarItem) => {
        if (ids.includes(item.id)) return;
        const newItem = { ...item };
        if (Array.isArray(item.data) && item.data.length > 0) {
          newItem.data = this.getFilteredMenuBarData(item.data, ids);
        }
        newData.push(newItem);
      });
    }
    return newData;
  }

  public getMenuBarDataByMode(
    mode: keyof typeof MenuBarMode,
    menuData: IMenuBarItem[]
  ): IMenuBarItem[] {
    const { MENUBAR_MODE_VERTICAL, MENUBAR_MODE_HORIZONTAL } =
      this.builtinService.getConstants();
    const ids: (string | undefined)[] = [];
    if (mode === MenuBarMode.horizontal) {
      ids.push(MENUBAR_MODE_HORIZONTAL);
    } else if (mode === MenuBarMode.vertical) {
      ids.push(MENUBAR_MODE_VERTICAL);
    }

    const menuBarData = this.getFilteredMenuBarData(menuData, ids);
    return menuBarData;
  }

  private updateActivityBarContextMenu(menuId: UniqueId) {
    const { MENU_VIEW_MENUBAR, CONTEXT_MENU_MENU } =
      this.builtinService.getConstants();
    if (CONTEXT_MENU_MENU && menuId === MENU_VIEW_MENUBAR) {
      this.activityBarService.toggleContextMenuChecked(CONTEXT_MENU_MENU);
    }
  }
}
