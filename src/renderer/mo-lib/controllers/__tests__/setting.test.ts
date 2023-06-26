import { sleep } from '@test/utils';
import { LocaleService } from '@/i18n';
import { LocalizationEvent } from '@/i18n/localization';
import { EditorEvent } from '@/model';
import {
  EditorService,
  SettingsService,
  NotificationService,
} from '@/services';
import { constants } from '@/services/builtinService/const';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { SettingsController } from '../settings';

const settingController = container.resolve(SettingsController);

const editorService = container.resolve(EditorService);
const settingsService = container.resolve(SettingsService);
const localeService = container.resolve(LocaleService);
const notificationService = container.resolve(NotificationService);

describe('The setting controller', () => {
  test('Should support to initialize', () => {
    const originalUpdate = editorService.onUpdateTab;
    const originalChange = localeService.onChange;
    const mockUpdate = jest.fn();
    const mockChange = jest.fn();

    editorService.onUpdateTab = mockUpdate;
    localeService.onChange = mockChange;

    settingController.initView();

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockChange).toHaveBeenCalled();

    editorService.onUpdateTab = originalUpdate;
    localeService.onChange = originalChange;
  });

  test('Should support to emit the update tab', async () => {
    settingController.initView();
    const mockFn = jest.fn();
    const item = {
      id: constants.SETTING_ID,
      data: {
        value: '{"a.b":"test"}',
      },
    };
    editorService.emit(EditorEvent.OnUpdateTab, item);
    settingsService.onChangeSettings(mockFn);

    await sleep(600);
    expect(mockFn).toHaveBeenCalled();
  });

  test('Should support to execute the notification', () => {
    const original = notificationService.toggleNotification;
    const mockFn = jest.fn();
    notificationService.toggleNotification = mockFn;
    const locale = { id: 'local', name: 'local' };
    localeService.emit(LocalizationEvent.OnChange, {}, locale);
    const { data } = notificationService.getState();
    expect(data).toHaveLength(1);
    expect(data![0]).toEqual(expect.objectContaining({ value: locale }));
    expect(mockFn).toHaveBeenCalled();

    notificationService.toggleNotification = original;
  });
});
