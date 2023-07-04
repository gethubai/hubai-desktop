import { container } from 'tsyringe';
import { Controller, connect } from '@hubai/core/esm/react';
import { IEditorController } from '@hubai/core/esm/controller/editor';
import { type IEditorService, type ILayoutService } from '@hubai/core';
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
