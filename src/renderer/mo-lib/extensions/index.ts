/* eslint-disable import/prefer-default-export */

import ExtendsFolderTree from './folderTree';
// import { ExtendsActivityBar } from './activityBar';
import ExtendsPanel from './panel';
import ExtendsExplorer from './explorer';
import ExtendsEditorTree from './editorTree';
import { ExtendsLocales } from './locales-defaults';
// import { githubPlusExtension } from './github-plus-theme-master';
import ExtendsEditor from './editor';
import { ExtendsActivityBar } from './activityBar';

/**
 * Default extensions
 */
export const defaultExtensions = [
  ExtendsPanel,
  ExtendsEditor,
  ExtendsActivityBar,
  ExtendsExplorer,
  ExtendsEditorTree,
  ExtendsLocales,
  // defaultColorThemeExtension,
  // monokaiColorThemeExtension,
  // paleNightColorThemeExtension,
  // webStormIntelliJExtension,
  // githubPlusExtension,
  ExtendsFolderTree,
];
