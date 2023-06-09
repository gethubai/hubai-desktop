import 'reflect-metadata';
import { container } from 'tsyringe';

import {
  type ILayoutService,
  LayoutService,
  ActivityBarService,
  type IActivityBarService,
  ExplorerService,
  type IExplorerService,
  FolderTreeService,
  type IFolderTreeService,
  SearchService,
  type ISearchService,
  type ISidebarService,
  SidebarService,
  type IMenuBarService,
  MenuBarService,
  type IStatusBarService,
  StatusBarService,
  EditorService,
  type IEditorService,
  type IPanelService,
  PanelService,
  type INotificationService,
  NotificationService,
  type IColorThemeService,
  ColorThemeService,
  type ISettingsService,
  SettingsService,
  type IProblemsService,
  ProblemsService,
  type IEditorTreeService,
  EditorTreeService,
  BuiltinService,
  ExtensionService,
  type IExtensionService,
  type IAuxiliaryBarService,
  AuxiliaryBarService,
} from 'mo/services';

import { type ILocaleService, LocaleService } from 'mo/i18n';
import { type IMonacoService, MonacoService } from './monaco/monacoService';

export * as event from 'mo/common/event';
export * as react from 'mo/react';
export * as component from 'mo/components';
export * as monaco from 'mo/monaco/api';
export * from 'mo/i18n';
export * from 'mo/workbench';
export * from 'mo/services';

export * as model from 'mo/model';

/**
 * The locale service
 */
export const i18n = container.resolve<ILocaleService>(LocaleService);

/**
 * The layout service
 */
export const layout = container.resolve<ILayoutService>(LayoutService);

/**
 * The activityBar service
 */
export const activityBar: IActivityBarService =
  container.resolve<IActivityBarService>(ActivityBarService);

export const auxiliaryBar =
  container.resolve<IAuxiliaryBarService>(AuxiliaryBarService);

export const explorer: IExplorerService =
  container.resolve<IExplorerService>(ExplorerService);

export const folderTree: IFolderTreeService =
  container.resolve<IFolderTreeService>(FolderTreeService);

export const editorTree =
  container.resolve<IEditorTreeService>(EditorTreeService);

export const search = container.resolve<ISearchService>(SearchService);
export const sidebar = container.resolve<ISidebarService>(SidebarService);
export const menuBar = container.resolve<IMenuBarService>(MenuBarService);
export const editor = container.resolve<IEditorService>(EditorService);
export const statusBar = container.resolve<IStatusBarService>(StatusBarService);
export const panel = container.resolve<IPanelService>(PanelService);
export const notification =
  container.resolve<INotificationService>(NotificationService);

export const problems = container.resolve<IProblemsService>(ProblemsService);

/**
 * The ColorTheme service
 */
export const colorTheme =
  container.resolve<IColorThemeService>(ColorThemeService);

/**
 * The Settings service
 */
export const settings = container.resolve<ISettingsService>(SettingsService);

export const builtin = container.resolve(BuiltinService);

/**
 * The Extension service
 */
export const extension = container.resolve<IExtensionService>(ExtensionService);

export const monacoService = container.resolve<IMonacoService>(MonacoService);
