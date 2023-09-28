import { container } from 'tsyringe';
import { Controller, connect } from '@hubai/core/esm/react';
import { type IEditorService, type ILayoutService } from '@hubai/core';
import { type IEditorController } from 'mo/controllers';
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
