/* eslint-disable import/prefer-default-export */
import { localize } from '@allai/core/esm/i18n/localize';
import { KeyMod, KeyCode } from '@allai/core/esm/monaco';
import { IEditorService } from '@allai/core';

import { constants } from '@allai/core/esm/services/builtinService/const';
import { KeybindingWeight } from '@allai/core/esm/monaco/common';
import { Action2 } from '@allai/core/esm/monaco/action';
import { container } from 'tsyringe';

export class QuickCopyLineUp extends Action2 {
  static readonly ID = constants.ACTION_QUICK_COPY_LINE_UP;

  static readonly LABEL = () => localize('menu.copyLineUp', 'Copy Line Up');

  static readonly DESC = 'Copy Line Up';

  private readonly editorService: IEditorService;

  constructor() {
    super({
      id: QuickCopyLineUp.ID,
      title: {
        value: QuickCopyLineUp.LABEL(),
        original: QuickCopyLineUp.DESC,
      },
      label: QuickCopyLineUp.LABEL(),
      alias: QuickCopyLineUp.DESC,
      f1: true,
      keybinding: {
        when: undefined,
        weight: KeybindingWeight.WorkbenchContrib,
        // eslint-disable-next-line new-cap
        primary: KeyMod.Alt | KeyMod.Shift | KeyCode.PageUp,
      },
    });
    this.editorService = container.resolve<IEditorService>('IEditorService');
  }

  run() {
    this.editorService.editorInstance
      ?.getAction(constants.ACTION_QUICK_COPY_LINE_UP)
      .run();
  }
}
