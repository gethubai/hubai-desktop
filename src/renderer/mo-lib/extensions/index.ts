/* eslint-disable import/prefer-default-export */

// eslint-disable-next-line import/no-cycle
import ExtendsFolderTree from './folderTree';
// import { ExtendsActivityBar } from './activityBar';
import ExtendsPanel from './panel';
import ExtendsExplorer from './explorer';
import ExtendsEditorTree from './editorTree';
import { ExtendsLocales } from './locales-defaults';
// import { githubPlusExtension } from './github-plus-theme-master';
import ExtendsEditor from './editor';
import { ExtendsActivityBar } from './activityBar';
import { defaultColorThemeExtension } from './themes/theme-defaults';
import packageStoreExtension from './packageStore/extension';
import { BrainChats } from './brainChats';
import shortcutRegister from './shortcutRegister';

// import { githubPlusExtension } from './themes/github-plus-theme-master';
// import { webStormIntelliJExtension } from './themes/vscode-intellij-darcula-theme-master';
/**
 * Default extensions
 */
export const defaultExtensions = [
  ExtendsPanel,
  ExtendsEditor,
  ExtendsActivityBar,
  BrainChats,
  ExtendsExplorer,
  ExtendsEditorTree,
  ExtendsLocales,
  defaultColorThemeExtension,
  packageStoreExtension,
  // monokaiColorThemeExtension,
  // paleNightColorThemeExtension,
  // webStormIntelliJExtension,
  // githubPlusExtension,
  ExtendsFolderTree,
  shortcutRegister,
];
