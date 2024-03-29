import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { cloneDeep, isEqual } from 'lodash';
import {
  ISettings,
  SettingsEvent,
  SettingsModel,
  type IColorThemeService,
  IEditorTab,
  type IEditorService,
  type ISettingsService,
  BuiltInSettingsTabType,
} from '@hubai/core';
import {
  flatObject,
  mergeObjects,
  normalizeFlattedObject,
} from '@hubai/core/esm/common/utils';
import { GlobalEvent } from '@hubai/core/esm/common/event';
import { type ILocaleService } from '@hubai/core/esm/i18n';
import rendererUserSettingsStorage from 'data/user/rendererUserSettingsStorage';
import { type IBuiltinService } from './builtinService';

@injectable()
class SettingsService extends GlobalEvent implements ISettingsService {
  protected settings: ISettings;

  constructor(
    @inject('IEditorService') private editorService: IEditorService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('IColorThemeService') private colorThemeService: IColorThemeService,
    @inject('ILocaleService') private localeService: ILocaleService
  ) {
    super();
    this.settings = {
      ...this.getBuiltInSettings(),
      ...(rendererUserSettingsStorage.getAll() ?? {}),
    };
  }

  saveSettings(): void {
    this.emit(SettingsEvent.OnSave, this.getSettings());
  }

  onSettingsSaved(callback: (settings: ISettings) => void): void {
    this.subscribe(SettingsEvent.OnSave, callback);
  }

  private getBuiltInSettings(): ISettings {
    const { editorOptions } = this.editorService.getState();
    const theme =
      this.settings?.colorTheme ?? this.colorThemeService.getColorTheme()?.id;
    const locale =
      this.settings?.locale ?? this.localeService.getCurrentLocale()?.id;
    const model = new SettingsModel(theme, editorOptions!, locale);
    return model;
  }

  public getDefaultSettingsTab(): BuiltInSettingsTabType {
    const { BuiltInSettingsTab } = this.builtinService.getModules();
    return { ...BuiltInSettingsTab };
  }

  public onChangeSettings(
    callback: (tab: IEditorTab<BuiltInSettingsTabType>) => void
  ): void {
    this.subscribe(SettingsEvent.OnChange, callback);
  }

  public update(settings: ISettings): void {
    this.applySettings(settings);
    const oldSettings = cloneDeep(this.settings);
    this.settings = mergeObjects(oldSettings, settings);
  }

  public append(settings: ISettings): void {
    this.update(settings);
  }

  public getSettings(): ISettings {
    const builtInSettings = this.getBuiltInSettings();
    return { ...builtInSettings, ...this.settings };
  }

  public applySettings(nextSettings: ISettings) {
    const oldSettings = this.settings;
    const { colorTheme, locale, editor }: ISettings = nextSettings;
    if (colorTheme && colorTheme !== oldSettings.colorTheme) {
      if (colorTheme !== this.colorThemeService.getColorTheme()?.id)
        this.colorThemeService.setTheme(colorTheme);
    }
    if (locale && locale !== oldSettings.locale) {
      this.localeService.setCurrentLocale(locale);
    }
    if (editor && !isEqual(editor, oldSettings.editor)) {
      this.editorService.updateEditorOptions(editor);
    }
  }

  public openSettingsInEditor(): void {
    const { BuiltInSettingsTab } = this.builtinService.getModules();
    if (BuiltInSettingsTab) {
      BuiltInSettingsTab.data!.value = this.flatObject2JSONString(
        this.getSettings()
      );
      this.editorService.open(BuiltInSettingsTab);
    }
  }

  public normalizeFlatObject<T = ISettings>(jsonStr: string): T {
    try {
      const obj = JSON.parse(jsonStr);
      return normalizeFlattedObject(obj) as any;
    } catch (e) {
      throw new Error(`SettingsService.normalizeFlatJSONObject error: ${e}`);
    }
  }

  public flatObject(obj: object): object {
    return flatObject(obj);
  }

  public flatObject2JSONString(obj: object): string {
    return this.toJSONString(this.flatObject(obj));
  }

  public toJSONString(obj: object, space: number = 4): string {
    try {
      return JSON.stringify(obj, null, space);
    } catch (e) {
      throw new Error(`SettingsService.toJSONString error: ${e}`);
    }
  }
}

export default SettingsService;
