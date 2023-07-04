/* eslint-disable import/prefer-default-export */
import { IFolderTreeController } from '@hubai/core/esm/controller/explorer/folderTree';
import { KeybindingWeight } from '@hubai/core/esm/monaco/common';
import { constants } from '@hubai/core/esm/services/builtinService/const';
import { Action2 } from '@hubai/core/esm/monaco/action';
import { localize } from '@hubai/core/esm/i18n/localize';
import { KeyMod, KeyCode } from '@hubai/core/esm/monaco';
import { FileTypes } from '@hubai/core/esm/model';
import { container } from 'tsyringe';

export class QuickCreateFile extends Action2 {
  static readonly ID = constants.ACTION_QUICK_CREATE_FILE;

  static readonly LABEL = () => localize('menu.newFile', 'New File');

  static readonly DESC = 'New File';

  private readonly folderTreeController: IFolderTreeController;

  constructor() {
    super({
      id: QuickCreateFile.ID,
      title: {
        value: QuickCreateFile.LABEL(),
        original: QuickCreateFile.DESC,
      },
      label: QuickCreateFile.LABEL(),
      alias: QuickCreateFile.DESC,
      f1: true,
      keybinding: {
        when: undefined,
        weight: KeybindingWeight.WorkbenchContrib,
        // eslint-disable-next-line new-cap
        primary: KeyMod.CtrlCmd | KeyCode.KeyN,
      },
    });
    this.folderTreeController = container.resolve<IFolderTreeController>(
      'IFolderTreeController'
    );
  }

  run() {
    this.folderTreeController.createTreeNode?.(FileTypes.File);
  }
}
