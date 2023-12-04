import { container } from 'tsyringe';

import './mo-lib/monaco/index';
import type {
  IEditorService,
  IActivityBarService,
  IAuxiliaryBarService,
  ISidebarService,
  ILayoutService,
  IMenuBarService,
  IPanelService,
  ISearchService,
  IStatusBarService,
  ISettingsService,
  IEditorTreeService,
  IExplorerService,
  IFolderTreeService,
  IProblemsService,
  INotificationService,
  IExtensionService,
  IColorThemeService,
  ILocaleService,
  IBrainClientManager,
  IToastService,
  IGlobalShortcutService,
  IUserShortcutService,
  IChatAssistantsManagement,
} from '@hubai/core';

import SidebarService from 'mo/services/workbench/sidebarService';
import ActivityBarService from 'mo/services/workbench/activityBarService';
import AuxiliaryBarService from 'mo/services/workbench/auxiliaryBarService';
import EditorService from 'mo/services/workbench/editorService';
import LayoutService from 'mo/services/workbench/layoutService';
import MenuBarService from 'mo/services/workbench/menuBarService';
import PanelService from 'mo/services/workbench/panelService';
import SearchService from 'mo/services/workbench/searchService';
import StatusBarService from 'mo/services/workbench/statusBarService';
import SettingsService from 'mo/services/settingsService';
import EditorTreeService from 'mo/services/workbench/explorer/editorTreeService';
import ExplorerService from 'mo/services/workbench/explorer/explorerService';
import FolderTreeService from 'mo/services/workbench/explorer/folderTreeService';
import BuiltinService, {
  type IBuiltinService,
} from 'mo/services/builtinService';
import ProblemsService from 'mo/services/problemsService';
import NotificationService from 'mo/services/notificationService';
import { ISideBarController, SidebarController } from 'mo/controllers/sidebar';
import EditorTreeController, {
  IEditorTreeController,
} from 'mo/controllers/explorer/editorTree';
import FolderTreeController, {
  IFolderTreeController,
} from 'mo/controllers/explorer/folderTree';
import {
  AuxiliaryController,
  ExtensionController,
  IAuxiliaryController,
  IExtensionController,
  ILayoutController,
  IMenuBarController,
  IOutlineController,
  IPanelController,
  IProblemsController,
  ISettingsController,
  LayoutController,
  MenuBarController,
  OutlineController,
  PanelController,
  ProblemsController,
  SettingsController,
} from 'mo/controllers';
import SearchController, {
  ISearchController,
} from 'mo/controllers/search/search';
import ActivityBarController, {
  IActivityBarController,
} from 'mo/controllers/activityBar';
import EditorController, { IEditorController } from 'mo/controllers/editor';
import NotificationController, {
  INotificationController,
} from 'mo/controllers/notification';
import ExplorerController, {
  IExplorerController,
} from 'mo/controllers/explorer/explorer';
import ExtensionService from 'mo/services/extensionService';
import ColorThemeService from 'mo/services/theme/colorThemeService';
import { IMonacoService } from '@hubai/core/esm/monaco/monacoService';
import MonacoService from 'mo/monaco/monacoService';
import StatusBarController, {
  IStatusBarController,
} from 'mo/controllers/statusBar';
import { registerChatCompletionProvider } from 'mo/monaco/registerChatCompletionProvider';
import { ChatStateModel, IChatState } from './features/chat/models/chat';
import { BrainStateModel, IBrainState } from './features/brain/models/brain';
import { ChatService } from './features/chat/services/chat';
import type { IChatService } from './features/chat/services/types';
import { IChatController } from './features/chat/controllers/type';
import ChatController from './features/chat/controllers/chat';
import { IBrainController } from './features/brain/controllers/type';
import BrainController from './features/brain/controllers/brain';
import { LocaleService } from './i18n/localeService';
import {
  type ILocalUserService,
  LocalUserService,
} from './features/user/services/userService';
import { ILocalUser, LocalUserModel } from './features/user/models/user';
import {
  ExtensionListStateModel,
  type IExtensionListState,
} from './features/extensions/models/extension';
import {
  BrainManagementService,
  IBrainManagementService,
} from './features/brain/services/brainManagement';
import {
  ExtensionManagementService,
  IExtensionManagementService,
} from './features/extensions/services/extensionManagement';
import { IExtensionListController } from './features/extensions/controllers/type';
import ExtensionListController from './features/extensions/controllers/extensionList';
import AuthController, {
  IAuthController,
} from './features/authentication/controllers/authController';
import {
  AuthenticationService,
  type IAuthService,
} from './features/authentication/services/authService';
import {
  AuthStateModel,
  IAuthState,
} from './features/authentication/models/auth';
import { PackageManagementService } from './features/packages/services/packageManagementService';
import { IPackageManagementService } from './features/packages/models/managementService';

import './http/registerHttpClients';
import { ElectronDownloadManager } from './features/downloader/electronDownloadManager';

import { type IDownloadManager } from './features/downloader/downloadManager';
import { type IContactService } from './features/contact/models/service';
import { ContactService } from './features/contact/services/contactService';
import { IChatClient } from './features/chat/sdk/contracts';
import { ChatClient } from './features/chat/sdk/chatClient';
import { BrainClientManager } from './features/brain/services/brainClientManager';
import { ChatAssistantsManagement } from './features/chat/services/chatAssistantManagement';
import { ToastService } from 'mo/services/toastService';
import { GlobalShortcutService } from 'mo/services/globalShortcutService';
import { UserShortcutService } from 'mo/services/userShortcutService';

container.registerSingleton<ISideBarController>(
  'ISidebarController',
  SidebarController
);
container.registerSingleton<IEditorTreeController>(
  'IEditorTreeController',
  EditorTreeController
);
container.registerSingleton<IFolderTreeController>(
  'IFolderTreeController',
  FolderTreeController
);

container.registerSingleton<IExplorerController>(
  'IExplorerController',
  ExplorerController
);

container.registerSingleton<IOutlineController>(
  'IOutlineController',
  OutlineController
);

container.registerSingleton<ISearchController>(
  'ISearchController',
  SearchController
);

container.registerSingleton<IActivityBarController>(
  'IActivityBarController',
  ActivityBarController
);

container.registerSingleton<IAuxiliaryController>(
  'IAuxiliaryController',
  AuxiliaryController
);

container.registerSingleton<IEditorController>(
  'IEditorController',
  EditorController
);

container.registerSingleton<IExtensionController>(
  'IExtensionController',
  ExtensionController
);

container.registerSingleton<IExtensionController>(
  'IExtensionController',
  ExtensionController
);

container.registerSingleton<ILayoutController>(
  'ILayoutController',
  LayoutController
);

container.registerSingleton<IMenuBarController>(
  'IMenuBarController',
  MenuBarController
);

container.registerSingleton<INotificationController>(
  'INotificationController',
  NotificationController
);

container.registerSingleton<IPanelController>(
  'IPanelController',
  PanelController
);

container.registerSingleton<IProblemsController>(
  'IProblemsController',
  ProblemsController
);

container.registerSingleton<ISettingsController>(
  'ISettingsController',
  SettingsController
);

container.registerSingleton<IStatusBarController>(
  'IStatusBarController',
  StatusBarController
);

container.registerSingleton<IChatController>('IChatController', ChatController);
container.registerSingleton<IChatAssistantsManagement>(
  'IChatAssistantsManagement',
  ChatAssistantsManagement
);
container.registerSingleton<IBrainController>(
  'IBrainController',
  BrainController
);

container.registerSingleton<IExtensionListController>(
  'IExtensionListController',
  ExtensionListController
);

container.registerSingleton<IAuthController>('IAuthController', AuthController);

container.registerSingleton<IPackageManagementService>(
  'IPackageManagementService',
  PackageManagementService
);

container.registerSingleton<IContactService>('IContactService', ContactService);

container.registerSingleton<ILocalUserService>(
  'ILocalUserService',
  LocalUserService
);

container.registerSingleton<IBuiltinService>('IBuiltinService', BuiltinService);
container.registerSingleton<IChatService>('IChatService', ChatService);
container.registerSingleton<IChatClient>('IChatClient', ChatClient);
container.registerSingleton<IBrainManagementService>(
  'IBrainManagementService',
  BrainManagementService
);
container.registerSingleton<IBrainClientManager>(
  'IBrainClientManager',
  BrainClientManager
);
container.registerSingleton<IExtensionManagementService>(
  'IExtensionManagementService',
  ExtensionManagementService
);
container.registerSingleton<ISidebarService>('ISidebarService', SidebarService);
container.registerSingleton<IActivityBarService>(
  'IActivityBarService',
  ActivityBarService
);
container.registerSingleton<IAuxiliaryBarService>(
  'IAuxiliaryBarService',
  AuxiliaryBarService
);
container.registerSingleton<IEditorService>('IEditorService', EditorService);
container.registerSingleton<ILayoutService>('ILayoutService', LayoutService);
container.registerSingleton<IMenuBarService>('IMenuBarService', MenuBarService);
container.registerSingleton<IPanelService>('IPanelService', PanelService);
container.registerSingleton<ISearchService>('ISearchService', SearchService);
container.registerSingleton<IStatusBarService>(
  'IStatusBarService',
  StatusBarService
);
container.registerSingleton<ISettingsService>(
  'ISettingsService',
  SettingsService
);
container.registerSingleton<IEditorTreeService>(
  'IEditorTreeService',
  EditorTreeService
);
container.registerSingleton<IExplorerService>(
  'IExplorerService',
  ExplorerService
);
container.registerSingleton<IFolderTreeService>(
  'IFolderTreeService',
  FolderTreeService
);

container.registerSingleton<IProblemsService>(
  'IProblemsService',
  ProblemsService
);

container.registerSingleton<INotificationService>(
  'INotificationService',
  NotificationService
);

container.registerSingleton<IColorThemeService>(
  'IColorThemeService',
  ColorThemeService
);

container.registerSingleton<IExtensionService>(
  'IExtensionService',
  ExtensionService
);

container.registerSingleton<ILocaleService>('ILocaleService', LocaleService);

container.registerSingleton<IMonacoService>('IMonacoService', MonacoService);

container.registerSingleton<IAuthService>(
  'IAuthService',
  AuthenticationService
);

container.registerSingleton<IDownloadManager>(
  'IDownloadManager',
  ElectronDownloadManager
);

container.registerSingleton<IToastService>('IToastService', ToastService);

container.registerSingleton<IGlobalShortcutService>(
  'IGlobalShortcutService',
  GlobalShortcutService
);

container.registerSingleton<IUserShortcutService>(
  'IUserShortcutService',
  UserShortcutService
);

/* Models */
container.register<IChatState>(ChatStateModel, {
  useValue: new ChatStateModel(),
});

container.register<IBrainState>(BrainStateModel, {
  useValue: new BrainStateModel(),
});

container.register<IExtensionListState>(ExtensionListStateModel, {
  useValue: new ExtensionListStateModel(),
});

const currentUser = window.electron.currentUser.get();
container.register<ILocalUser>(LocalUserModel, {
  useValue: new LocalUserModel(currentUser.id, currentUser.profile.name, []),
});

container.register<IAuthState>('IAuthState', {
  useValue: new AuthStateModel(),
});

registerChatCompletionProvider();

console.log('Services have been registered');
