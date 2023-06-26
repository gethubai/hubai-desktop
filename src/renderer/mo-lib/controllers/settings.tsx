import React from 'react';
import { container, inject, injectable } from 'tsyringe';
import { debounce } from 'lodash';

import {
  type IBuiltinService,
  type IEditorService,
  type ISettingsService,
  type INotificationService,
  SettingsEvent,
  Controller,
} from '@allai/core';
import { ILocale, ILocaleService, LocaleService } from '@allai/core/esm/i18n';
import { LocaleNotification } from '@allai/core/esm/workbench/notification/notificationPane/localeNotification';

export interface ISettingsController extends Partial<Controller> {}

@injectable()
export class SettingsController
  extends Controller
  implements ISettingsController
{
  private readonly localeService: ILocaleService;

  constructor(
    @inject('IEditorService') private editorService: IEditorService,
    @inject('ISettingsService') private settingsService: ISettingsService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('INotificationService')
    private notificationService: INotificationService
  ) {
    super();
    this.localeService = container.resolve(LocaleService);
  }

  /**
   * Delay the each Settings change event 600 milliseconds,
   * and then call the `update` and `emit` functions;
   */
  private onChangeSettings = debounce((args) => {
    this.settingsService.update(args);
    this.emit(SettingsEvent.OnChange, args);
  }, 600);

  public initView() {
    const { SETTING_ID } = this.builtinService.getConstants();
    this.editorService.onUpdateTab((tab) => {
      if (tab.id === SETTING_ID) {
        const settingsValue = this.settingsService.normalizeFlatObject(
          tab.data?.value || ''
        );
        this.onChangeSettings(settingsValue);
      }
    });
    this.localeService.onChange((prev: ILocale, next: ILocale) => {
      this.notifyLocaleChanged(prev, next);
    });
  }

  private notifyLocaleChanged(prev: ILocale, next: ILocale) {
    const { SETTING_ID } = this.builtinService.getConstants();
    const notify = {
      id: SETTING_ID!,
      value: next,
      render(value) {
        /* istanbul ignore next */
        return <LocaleNotification key={next.id} locale={next.name} />;
      },
    };
    if (!this.notificationService.getState().showNotifications) {
      this.notificationService.toggleNotification();
    }
    this.notificationService.add([notify]);
  }
}
