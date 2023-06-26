/* eslint-disable import/prefer-default-export */
import { localize } from 'monaco-editor/esm/vs/nls';
import { KeyChord } from 'monaco-editor/esm/vs/base/common/keyCodes';
import { ServicesAccessor } from 'monaco-editor/esm/vs/platform/instantiation/common/instantiation';

import { KeyMod, KeyCode } from '@allai/core/esm/monaco';
import { KeybindingWeight } from '@allai/core/esm/monaco/common';
import { Action2 } from '@allai/core/esm/monaco/action';
import { constants } from '@allai/core/esm/services/builtinService/const';
import { ISettingsService } from '@allai/core/esm/services';
import { DIService } from '@allai/core/esm/DIService';

export class QuickAccessSettings extends Action2 {
  static readonly ID = constants.ACTION_QUICK_ACCESS_SETTINGS;

  static readonly LABEL = localize(
    'quickAccessSettings.label',
    'Open Settings (JSON)'
  );

  private readonly settingsService: ISettingsService;

  constructor() {
    super({
      id: QuickAccessSettings.ID,
      label: QuickAccessSettings.LABEL,
      title: QuickAccessSettings.LABEL,
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
    this.settingsService = DIService.get<ISettingsService>('ISettingsService');
  }

  run(accessor: ServicesAccessor) {
    this.settingsService.openSettingsInEditor();
  }
}
