/* eslint-disable import/prefer-default-export */
import { ServicesAccessor } from 'monaco-editor/esm/vs/platform/instantiation/common/instantiation';
import { KeyChord } from 'monaco-editor/esm/vs/base/common/keyCodes';

import { localize } from '@hubai/core/esm/i18n/localize';
import { KeyMod, KeyCode } from '@hubai/core/esm/monaco';
import {
  IActivityBarService,
  type ILayoutService,
  IMenuBarService,
  type ISidebarService,
} from '@hubai/core/esm/services';
import { ID_SIDE_BAR } from '@hubai/core/esm/common/id';
import type { UniqueId } from '@hubai/core/esm/common/types';
import { Action2 } from '@hubai/core/esm/monaco/action';
import { CATEGORIES, KeybindingWeight } from '@hubai/core/esm/monaco/common';
import { container } from 'tsyringe';

export class CommandQuickSideBarViewAction extends Action2 {
  static readonly ID = ID_SIDE_BAR;

  static readonly LABEL = () =>
    localize('menu.showSideBar.label', 'Toggle Side Bar Visibility');

  private readonly sideBarService: ISidebarService;

  private readonly layoutService: ILayoutService;

  private readonly menuBarService: IMenuBarService;

  private readonly activityBarService: IActivityBarService;

  private _preActivityBar: UniqueId | undefined;

  constructor() {
    super({
      id: CommandQuickSideBarViewAction.ID,
      label: CommandQuickSideBarViewAction.LABEL(),
      title: CommandQuickSideBarViewAction.LABEL(),
      category: CATEGORIES.View,
      alias: 'Toggle Side Bar',
      precondition: undefined,
      f1: true,
      keybinding: {
        when: undefined,
        weight: KeybindingWeight.WorkbenchContrib,
        // eslint-disable-next-line new-cap
        primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyB),
      },
    });
    this.layoutService = container.resolve<ILayoutService>('ILayoutService');
    this.menuBarService = container.resolve<IMenuBarService>('IMenuBarService');
    this.activityBarService = container.resolve<IActivityBarService>(
      'IActivityBarService'
    );
    this.sideBarService = container.resolve<ISidebarService>('ISidebarService');
  }

  run(accessor: ServicesAccessor, ...args: any[]) {
    const sidebarId = args[0];
    const { selected } = this.activityBarService.getState();

    const hidden = this.layoutService.toggleSidebarVisibility();

    const activityId = sidebarId || this._preActivityBar;
    this.activityBarService.setActive(hidden ? undefined : activityId);
    this.sideBarService.setActive(hidden ? undefined : activityId);
    this.menuBarService.update(CommandQuickSideBarViewAction.ID, {
      icon: hidden ? '' : 'check',
    });

    if (hidden) {
      this._preActivityBar = selected;
    }
  }
}
