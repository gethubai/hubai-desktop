import { Controller } from '@hubai/core/esm/react/controller';
import { inject, injectable } from 'tsyringe';
import { type IBuiltinService, type IExtensionService } from '@hubai/core';
import { SelectLocaleAction } from '@hubai/core/esm/i18n/selectLocaleAction';
import { ID_SIDE_BAR } from '@hubai/core/esm/common/id';
import type { Action2 } from '@hubai/core/esm/monaco/action';
import { CommandQuickAccessViewAction } from 'mo/monaco/quickAccessViewAction';
import { QuickAccessSettings } from 'mo/monaco/quickAccessSettingsAction';
import { SelectColorThemeAction } from 'mo/monaco/selectColorThemeAction';
import { CommandQuickSideBarViewAction } from 'mo/monaco/quickToggleSideBarAction';
import { QuickTogglePanelAction } from 'mo/monaco/quickTogglePanelAction';
import { QuickSelectAllAction } from 'mo/monaco/quickSelectAllAction';
import { QuickCopyLineUp } from 'mo/monaco/quickCopyLineUp';
import { QuickUndo } from 'mo/monaco/quickUndo';
import { QuickRedo } from 'mo/monaco/quickRedo';
import { QuickCreateFile } from 'mo/monaco/quickCreateFile';

export interface IExtensionController extends Partial<Controller> {}

@injectable()
export class ExtensionController
  extends Controller
  implements IExtensionController
{
  constructor(
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('IExtensionService') private extensionService: IExtensionService
  ) {
    super();
  }

  public initView() {
    const {
      quickAcessViewAction,
      quickSelectColorThemeAction,
      quickAccessSettingsAction,
      quickSelectLocaleAction,
      quickTogglePanelAction,
      quickSelectAllAction,
      quickCopyLineUpAction,
      quickUndoAction,
      quickRedoAction,
      quickCreateFileAction,
    } = this.builtinService.getModules();
    (
      [
        [quickAcessViewAction, CommandQuickAccessViewAction],
        [quickSelectColorThemeAction, SelectColorThemeAction],
        [quickAccessSettingsAction, QuickAccessSettings],
        [quickSelectLocaleAction, SelectLocaleAction],
        [ID_SIDE_BAR, CommandQuickSideBarViewAction],
        [quickTogglePanelAction, QuickTogglePanelAction],
        [quickSelectAllAction, QuickSelectAllAction],
        [quickCopyLineUpAction, QuickCopyLineUp],
        [quickUndoAction, QuickUndo],
        [quickRedoAction, QuickRedo],
        [quickCreateFileAction, QuickCreateFile],
      ] as [any, new () => Action2][]
    ).forEach(([key, action]) => {
      if (key) {
        this.extensionService.registerAction(action);
      }
    });
  }
}
