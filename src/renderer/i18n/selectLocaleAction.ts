import {
  IQuickInputService,
  QuickPickInput,
} from 'monaco-editor/esm/vs/platform/quickinput/common/quickInput';
import { ServicesAccessor } from 'monaco-editor/esm/vs/platform/instantiation/common/instantiation';

import { Action2 } from '@hubai/core/esm/monaco/action';
import { KeyCode, KeyMod } from '@hubai/core/esm/monaco';
import { constants } from 'mo/services/builtinService/const';
import { DIService } from '@hubai/core/esm/DIService';
import { localize } from '@hubai/core/esm/i18n/localize';
import { ILocale } from '@hubai/core/esm/i18n/localization';
import { ILocaleService } from '@hubai/core/esm/i18n/localeService';

export class SelectLocaleAction extends Action2 {
  static readonly ID = constants.ACTION_SELECT_LOCALE;

  static readonly LABEL = () =>
    localize('select.locale', 'Select Display Language');

  private get localeService(): ILocaleService {
    return DIService.get<ILocaleService>('ILocaleService');
  }

  constructor() {
    super({
      id: SelectLocaleAction.ID,
      label: SelectLocaleAction.LABEL(),
      title: SelectLocaleAction.LABEL(),
      alias: 'Select Display Language',
      precondition: undefined,
      f1: true,
      keybinding: {
        when: undefined,
        primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL,
      },
    });
  }

  run(accessor: ServicesAccessor): Promise<void> {
    const quickInputService = accessor.get(IQuickInputService);
    const data = this.localeService.getLocales();
    const current = this.localeService.getCurrentLocale();

    const picks: QuickPickInput<ILocale>[] = data.map((item: ILocale) => {
      return {
        id: item.id,
        label: item.name,
        description: item.description,
      };
    });

    let timer: number | undefined;

    const onSelect = (locale: ILocale | undefined, apply: boolean) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = window.setTimeout(
        () => {
          timer = undefined;
          if (locale && locale.id) {
            this.localeService.setCurrentLocale(locale.id);
          }
        },
        apply ? 0 : 200
      );
    };

    return new Promise((resolve) => {
      let isCompleted = false;

      const autoFocusIndex = picks.findIndex((p) => p.id === current?.id);
      const quickPick = quickInputService.createQuickPick<ILocale>();
      quickPick.items = picks;

      quickPick.placeholder = localize(
        'locale.select',
        'Select Display Language (Up/Down Keys to Preview)'
      );

      quickPick.activeItems = [picks[autoFocusIndex]];
      quickPick.canSelectMany = false;
      quickPick.onDidAccept(() => {
        const item = quickPick.activeItems[0];
        if (item) {
          onSelect(item, true);
        }
        isCompleted = true;
        quickPick.hide();
        resolve();
      });

      quickPick.onDidHide(() => {
        if (!isCompleted) {
          onSelect(current, true);
          resolve();
        }
      });

      quickPick.show();
    });
  }
}
