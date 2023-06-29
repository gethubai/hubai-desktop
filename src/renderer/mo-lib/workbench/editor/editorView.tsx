import { container } from 'tsyringe';
import { Controller, connect } from '@allai/core/esm/react';
import { IEditorController } from '@allai/core/esm/controller/editor';
import { type IEditorService, type ILayoutService } from '@allai/core';
import { Editor } from './editor';
import { EditorStatusBarView } from './statusBarView';

const editorService = container.resolve<IEditorService>('IEditorService');
const layoutService = container.resolve<ILayoutService>('ILayoutService');

const editorController =
  container.resolve<IEditorController>('IEditorController');

const EditorView = connect(
  { editor: editorService, layout: layoutService },
  Editor,
  editorController as Controller
);

export { Editor, EditorStatusBarView, EditorView };
