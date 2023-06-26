/* eslint-disable import/prefer-default-export */
import { localize } from '@allai/core/esm/i18n/localize';
import {
  KeyMod,
  KeyCode,
  Uri,
  editor as MonacoEditor,
} from '@allai/core/esm/monaco';
import { IEditorService } from '@allai/core/esm/services';
import { KeybindingWeight } from '@allai/core/esm/monaco/common';
import { Action2 } from '@allai/core/esm/monaco/action';
import { constants } from '@allai/core/esm/services/builtinService/const';
import { DIService } from '@allai/core/esm/DIService';

export class QuickRedo extends Action2 {
  static readonly ID = constants.ACTION_QUICK_REDO;

  static readonly LABEL = localize('menu.redo', 'Redo');

  static readonly DESC = 'Redo';

  private readonly editorService: IEditorService;

  constructor() {
    super({
      id: QuickRedo.ID,
      title: {
        value: QuickRedo.LABEL,
        original: QuickRedo.DESC,
      },
      label: QuickRedo.LABEL,
      alias: QuickRedo.DESC,
      f1: true,
      keybinding: {
        when: undefined,
        weight: KeybindingWeight.WorkbenchContrib,
        // eslint-disable-next-line new-cap
        primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ,
      },
    });
    this.editorService = DIService.get<IEditorService>('IEditorService');
  }

  isTextdom(ele: Element): ele is HTMLInputElement {
    return typeof (ele as HTMLInputElement).selectionStart === 'number';
  }

  run(accessor, ...args) {
    const focusinEle = args[0];
    const currentFocusinEle: Element | null =
      focusinEle || document.activeElement;
    if (
      currentFocusinEle &&
      this.isTextdom(currentFocusinEle) &&
      !currentFocusinEle.className.includes('monaco')
    ) {
      // native dom use the native methods
      document.execCommand('redo');
    } else {
      // monaco component should use the method from instance
      const { editorInstance } = this.editorService;
      if (editorInstance) {
        const currentActiveGroup = this.editorService.getState().current;
        if (currentActiveGroup) {
          const tab = this.editorService.getTabById(
            currentActiveGroup.activeTab!,
            currentActiveGroup.id!
          );
          editorInstance?.focus();
          const model = MonacoEditor.getModel(Uri.parse(tab!.id!.toString()))!;
          (model as any).redo();
        }
      }
    }
  }
}
