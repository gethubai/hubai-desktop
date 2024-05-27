/* eslint-disable import/prefer-default-export */
import { localize } from 'monaco-editor/esm/vs/nls';
import { KeyChord } from 'monaco-editor/esm/vs/base/common/keyCodes';
import { ServicesAccessor } from 'monaco-editor/esm/vs/platform/instantiation/common/instantiation';

import { KeyMod, KeyCode } from '@hubai/core/esm/monaco';
import { KeybindingWeight } from '@hubai/core/esm/monaco/common';
import { Action2 } from '@hubai/core/esm/monaco/action';
import { ISettingsService } from '@hubai/core/esm/services';
import { container } from 'tsyringe';
import { constants } from 'mo/services/builtinService/const';

export class QuickAccessSettings extends Action2 {
  static readonly ID = constants.ACTION_QUICK_ACCESS_SETTINGS;

  static readonly LABEL = () =>
    localize('quickAccessSettings.label', 'Open Settings (JSON)');

  private readonly settingsService: ISettingsService;

  constructor() {
    super({
      id: QuickAccessSettings.ID,
      label: QuickAccessSettings.LABEL(),
      title: QuickAccessSettings.LABEL(),
      alias: 'Open Settings (JSON)',
      precondition: undefined,
      f1: true,
      keybinding: {
        when: undefined,
        weight: KeybindingWeight.WorkbenchContrib,
        // eslint-disable-next-line new-cap
        primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Comma),
      },
    });
    this.settingsService =
      container.resolve<ISettingsService>('ISettingsService');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(accessor: ServicesAccessor) {
    this.settingsService.openSettingsInEditor();
  }
}
