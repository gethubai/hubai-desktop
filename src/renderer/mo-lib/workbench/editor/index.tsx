import 'reflect-metadata';
import { connect } from 'mo/react';
import { container } from 'tsyringe';
import { EditorController } from 'mo/controller/editor';
import { EditorService, LayoutService } from 'mo/services';
import { Editor } from './editor';
import { EditorStatusBarView } from './statusBarView';

const editorService = container.resolve(EditorService);
const layoutService = container.resolve(LayoutService);

const editorController = container.resolve(EditorController);

const EditorView = connect(
  { editor: editorService, layout: layoutService },
  Editor,
  editorController
);

export { Editor, EditorStatusBarView, EditorView };
