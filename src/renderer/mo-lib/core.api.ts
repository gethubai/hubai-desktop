import 'reflect-metadata';
import { container } from 'tsyringe';

import {
  type ILayoutService,
  IActivityBarService,
  type IExplorerService,
  type IFolderTreeService,
  type ISearchService,
  type IMenuBarService,
  type IStatusBarService,
  type IEditorService,
  type IPanelService,
  type INotificationService,
  type IColorThemeService,
  type ISettingsService,
  type IProblemsService,
  type IEditorTreeService,
  type IExtensionService,
  type IAuxiliaryBarService,
  type ILocaleService,
  LocaleService,
  type ISidebarService,
  IBuiltinService,
} from '@allai/core';

import { type IMonacoService } from '@allai/core/esm/monaco/monacoService';

/**
 * The locale service
 */
export const i18n = container.resolve<ILocaleService>(LocaleService);

/**
 * The layout service
 */
export const layout = container.resolve<ILayoutService>('ILayoutService');

/**
 * The activityBar service
 */
export const activityBar: IActivityBarService =
  container.resolve<IActivityBarService>('IActivityBarService');

export const auxiliaryBar = container.resolve<IAuxiliaryBarService>(
  'IAuxiliaryBarService'
);

export const explorer: IExplorerService =
  container.resolve<IExplorerService>('IExplorerService');

export const folderTree: IFolderTreeService =
  container.resolve<IFolderTreeService>('IFolderTreeService');

export const editorTree =
  container.resolve<IEditorTreeService>('IEditorTreeService');

export const search = container.resolve<ISearchService>('ISearchService');
export const sidebar = container.resolve<ISidebarService>('ISidebarService');
export const menuBar = container.resolve<IMenuBarService>('IMenuBarService');
export const editor = container.resolve<IEditorService>('IEditorService');
export const statusBar =
  container.resolve<IStatusBarService>('IStatusBarService');
export const panel = container.resolve<IPanelService>('IPanelService');
export const notification = container.resolve<INotificationService>(
  'INotificationService'
);

export const problems = container.resolve<IProblemsService>('IProblemsService');

/**
 * The ColorTheme service
 */
export const colorTheme =
  container.resolve<IColorThemeService>('IColorThemeService');

/**
 * The Settings service
 */
export const settings = container.resolve<ISettingsService>('ISettingsService');

export const builtin = container.resolve<IBuiltinService>('IBuiltinService');

/**
 * The Extension service
 */
export const extension =
  container.resolve<IExtensionService>('IExtensionService');

export const monacoService =
  container.resolve<IMonacoService>('IMonacoService');
