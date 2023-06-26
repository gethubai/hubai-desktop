/* eslint-disable import/prefer-default-export */
import { ServicesAccessor } from 'monaco-editor/esm/vs/platform/instantiation/common/instantiation';
import { KeyChord } from 'monaco-editor/esm/vs/base/common/keyCodes';

import { localize } from '@allai/core/esm/i18n/localize';
import { KeyMod, KeyCode } from '@allai/core/esm/monaco';
import {
  IActivityBarService,
  type ILayoutService,
  IMenuBarService,
  type ISidebarService,
} from '@allai/core/esm/services';
import { ID_SIDE_BAR } from '@allai/core/esm/common/id';
import type { UniqueId } from '@allai/core/esm/common/types';
import { Action2 } from '@allai/core/esm/monaco/action';
import { CATEGORIES, KeybindingWeight } from '@allai/core/esm/monaco/common';
import { DIService } from '@allai/core/esm/DIService';

export class CommandQuickSideBarViewAction extends Action2 {
  static readonly ID = ID_SIDE_BAR;

  static readonly LABEL = localize(
    'menu.showSideBar.label',
    'Toggle Side Bar Visibility'
  );

  private readonly sideBarService: ISidebarService;

  private readonly layoutService: ILayoutService;

  private readonly menuBarService: IMenuBarService;

  private readonly activityBarService: IActivityBarService;

  private _preActivityBar: UniqueId | undefined;

  constructor() {
    super({
      id: CommandQuickSideBarViewAction.ID,
      label: CommandQuickSideBarViewAction.LABEL,
      title: CommandQuickSideBarViewAction.LABEL,
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
    this.layoutService = DIService.get<ILayoutService>('ILayoutService');
    this.menuBarService = DIService.get<IMenuBarService>('IMenuBarService');
    this.activityBarService = DIService.get<IActivityBarService>(
      'IActivityBarService'
    );
    this.sideBarService = DIService.get<ISidebarService>('ISidebarService');
  }

  run(accessor: ServicesAccessor, ...args) {
    const sidebarId = args[0];
    const { selected } = this.activityBarService.getState();

    const hidden = this.layoutService.toggleSidebarVisibility();

    const activityId = sidebarId || this._preActivityBar;
    this.activityBarService.setActive(hidden ? undefined : activityId);
    this.sideBarService.setActive(hidden ? undefined : activityId);
    this.menuBarService.update(CommandQuickSideBarViewAction.ID, {
      icon: hidden ? '' : 'check',
    });

    hidden && (this._preActivityBar = selected);
  }
}
