import {
  IActionBarItemProps,
  IMenuItemProps,
  ITabProps,
} from '@hubai/core/esm/components';
import { EditorTreeEvent } from '@hubai/core/esm/model/workbench/explorer/editorTree';
import { Component } from '@hubai/core/esm/react';
import { inject, injectable } from 'tsyringe';
import { UniqueId } from '@hubai/core/esm/common/types';
import {
  IEditorTreeService,
  type IEditorService,
  IEditor,
  IEditorTab,
} from '@hubai/core';

@injectable()
class EditorTreeService
  extends Component<IEditor>
  implements IEditorTreeService
{
  protected state: IEditor;

  constructor(@inject('IEditorService') private editorService: IEditorService) {
    super();
    this.state = this.editorService.getState();
  }

  public onClose(callback: (tabId: UniqueId, groupId: UniqueId) => void) {
    this.subscribe(EditorTreeEvent.onClose, callback);
  }

  public onCloseOthers(
    callback: (tabItem: IEditorTab, groupId: UniqueId) => void
  ) {
    this.subscribe(EditorTreeEvent.onCloseOthers, callback);
  }

  public onCloseSaved(callback: (groupId: UniqueId) => void) {
    this.subscribe(EditorTreeEvent.onCloseSaved, callback);
  }

  public onSelect(callback: (tabId: UniqueId, groupId: UniqueId) => void) {
    this.subscribe(EditorTreeEvent.onSelect, callback);
  }

  public onCloseAll(callback: (groupId?: UniqueId) => void) {
    this.subscribe(EditorTreeEvent.onCloseAll, callback);
  }

  public onSaveAll(callback: (groupId?: UniqueId) => void) {
    this.subscribe(EditorTreeEvent.onSaveAll, callback);
  }

  public onToolbarClick(
    callback: (toolbar: IActionBarItemProps, groupId?: UniqueId) => void
  ) {
    this.subscribe(EditorTreeEvent.onToolbarClick, callback);
  }

  public onLayout(callback: () => void) {
    this.subscribe(EditorTreeEvent.onSplitEditorLayout, callback);
  }

  public onContextMenu(
    callback: (menu: IMenuItemProps, file: ITabProps, groupId: UniqueId) => void
  ) {
    this.subscribe(EditorTreeEvent.onContextMenu, callback);
  }
}

export default EditorTreeService;
