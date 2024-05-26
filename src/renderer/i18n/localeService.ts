/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import { injectable } from 'tsyringe';
import { APP_PREFIX } from '@hubai/core/esm/common/const';
import logger from '@hubai/core/esm/common/logger';
import { ILocale, LocalizationEvent } from '@hubai/core/esm/i18n/localization';

import { Component } from '@hubai/core/esm/react';
import { ILocaleService } from '@hubai/core';

export const STORE_KEY = `${APP_PREFIX}.localeId`;
export const DEFAULT_LOCALE_ID = `${APP_PREFIX}.defaultLocaleId`;

@injectable()
export class LocaleService extends Component implements ILocaleService {
  state = {};

  // eslint-disable-next-line no-template-curly-in-string
  private static LOCALIZE_REPLACED_WORD = '${i}';

  private _locales = new Map<string, ILocale>();

  private _current: ILocale | undefined;

  constructor() {
    super();
  }

  public reset(): void {
    localStorage.removeItem(STORE_KEY);
    this._current = undefined;
    this._locales.clear();
  }

  public getLocales(): ILocale[] {
    return Array.from(this._locales.values());
  }

  public initialize(locales: ILocale[], localeId: string) {
    this.addLocales(locales);
    if (this._locales.get(localeId)) {
      this._current = this._locales.get(localeId);
    } else {
      logger.error(`Cannot initialize the locale with ${localeId}`);
    }
  }

  public getCurrentLocale(): ILocale | undefined {
    return this._current && { ...this._current };
  }

  public getLocale(id: string | null): ILocale | undefined {
    if (!id) return undefined;
    return this._locales.get(id);
  }

  public removeLocale(id: string): ILocale | undefined {
    const locale = this._locales.get(id);
    if (locale !== undefined) {
      if (this._locales.size === 1) {
        logger.error(
          "You can't remove this Locale because there must have one locale at least"
        );
        return undefined;
      }
      if (this._current && this._current.id === locale.id) {
        this._current = this._locales.values().next().value;
      }
      this._locales.delete(id);
      return locale;
    }
    return undefined;
  }

  public setCurrentLocale(id: string): boolean {
    if (this._current && this._current.id === id) return true;
    const locale = this._locales.get(id);
    if (locale) {
      this.emit(LocalizationEvent.OnChange, this._current, locale);
      this._current = locale;
      localStorage.setItem(STORE_KEY, locale.id);
      return true;
    }
    return false;
  }

  private transformLocaleData(locale: ILocale): ILocale {
    const newLocale = { ...locale };
    // Convert a normal Object to a Map
    if (!(locale.source instanceof Map)) {
      newLocale.source = new Map(Object.entries(locale.source));
    }
    // If current locale inherit an exist, merge the parent.
    if (newLocale.inherit) {
      const parent = this._locales.get(newLocale.inherit);
      if (parent) {
        newLocale.source = new Map([...parent.source, ...newLocale.source]);
      }
    }
    return newLocale;
  }

  public addLocales(locales: ILocale[]): void {
    if (locales.length > 0) {
      const origin = this._locales;
      locales.forEach((locale: ILocale) => {
        const key = locale.id;
        if (!origin.has(key)) {
          origin.set(key, this.transformLocaleData(locale));
        }
      });
    }
  }

  public onChange(callback: (prev: ILocale, next: ILocale) => void): void {
    this.subscribe(LocalizationEvent.OnChange, callback);
  }

  public localize(
    sourceKey: string,
    defaultValue: string,
    ...args: string[]
  ): string {
    let result = defaultValue;
    if (this._current) {
      result = this._current.source.get(sourceKey) || defaultValue;
    }
    if (args.length) {
      args.forEach((replacedVal) => {
        result = result.replace(
          LocaleService.LOCALIZE_REPLACED_WORD,
          replacedVal
        );
      });
    }
    return result;
  }
}
