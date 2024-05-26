import { inject, injectable } from 'tsyringe';
import {
  type IExplorerService,
  type IEditorService,
  EditorTreeEvent,
  Controller,
} from '@hubai/core';
import {
  EditorTree,
  IOpenEditProps,
} from 'mo/workbench/sidebar/explore/editorTree';
import { connect } from '@hubai/core/esm/react';
import {
  IActionBarItemProps,
  IMenuItemProps,
  ITabProps,
} from '@hubai/core/esm/components';
import type { UniqueId } from '@hubai/core/esm/common/types';
import { type IBuiltinService } from 'mo/services/builtinService';

export interface IEditorTreeController extends Partial<Controller> {
  readonly onClose?: (tabId: UniqueId, groupId: UniqueId) => void;
  readonly onSelect?: (tabId: UniqueId, groupId: UniqueId) => void;
  readonly onCloseGroup?: (groupId: UniqueId) => void;
  readonly onSaveGroup?: (groupId: UniqueId) => void;
  readonly onToolbarClick?: (
    toolbar: IActionBarItemProps,
    groupId: UniqueId
  ) => void;
  /**
   * Trigger by context menu click event
   * When click the context menu from group header, it doesn't have file info
   */
  readonly onContextMenu?: (
    menu: IMenuItemProps,
    groupId: UniqueId,
    file?: ITabProps
  ) => void;
}

@injectable()
class EditorTreeController extends Controller implements IEditorTreeController {
  constructor(
    @inject('IEditorService') private editService: IEditorService,
    @inject('IExplorerService') private explorerService: IExplorerService,
    @inject('IBuiltinService') private builtinService: IBuiltinService
  ) {
    super();
  }

  public initView() {
    const EditorTreeView = connect<IOpenEditProps>(
      this.editService,
      EditorTree
    );
    const {
      builtInExplorerEditorPanel,
      builtInEditorTreeContextMenu,
      builtInEditorTreeHeaderContextMenu,
    } = this.builtinService.getModules();
    if (builtInExplorerEditorPanel) {
      const { groupToolbar, ...restEditor } = builtInExplorerEditorPanel;
      const contextMenu = builtInEditorTreeContextMenu || [];
      const headerContextMenu = builtInEditorTreeHeaderContextMenu || [];

      this.explorerService.addPanel({
        ...restEditor,
        renderPanel: (panel) => (
          <EditorTreeView
            panel={panel}
            contextMenu={contextMenu}
            headerContextMenu={headerContextMenu}
            groupToolbar={groupToolbar}
            onClose={this.onClose}
            onSelect={this.onSelect}
            onCloseGroup={this.onCloseGroup}
            onSaveGroup={this.onSaveGroup}
            onContextMenu={this.onContextMenu}
            onToolbarClick={this.onToolbarClick}
          />
        ),
      });
    }
  }

  public onContextMenu = (
    menu: IMenuItemProps,
    groupId: UniqueId,
    file?: ITabProps
  ) => {
    const {
      EDITOR_MENU_CLOSE,
      EDITOR_MENU_CLOSE_OTHERS,
      EDITOR_MENU_CLOSE_SAVED,
      EDITOR_MENU_CLOSE_ALL,
    } = this.builtinService.getConstants();

    switch (menu.id) {
      case EDITOR_MENU_CLOSE:
        this.onClose(file?.id, groupId);
        break;

      case EDITOR_MENU_CLOSE_OTHERS:
        this.emit(EditorTreeEvent.onCloseOthers, file, groupId);
        break;

      case EDITOR_MENU_CLOSE_SAVED:
        this.emit(EditorTreeEvent.onCloseSaved, groupId);
        break;

      case EDITOR_MENU_CLOSE_ALL:
        this.emit(EditorTreeEvent.onCloseAll, groupId);
        break;

      default:
        this.emit(EditorTreeEvent.onContextMenu, menu, file, groupId);
        break;
    }
  };

  public onClose = (tabId: UniqueId | undefined, groupId: UniqueId) => {
    if (tabId) {
      this.emit(EditorTreeEvent.onClose, tabId, groupId);
    }
  };

  public onSelect = (tabId: UniqueId, groupId: UniqueId) => {
    this.emit(EditorTreeEvent.onSelect, tabId, groupId);
  };

  public onCloseGroup = (groupId: UniqueId) => {
    this.emit(EditorTreeEvent.onCloseAll, groupId);
  };

  public onSaveGroup = (groupId: UniqueId) => {
    this.emit(EditorTreeEvent.onSaveAll, groupId);
  };

  public onToolbarClick = (toolbar: IActionBarItemProps, groupId: UniqueId) => {
    this.emit(EditorTreeEvent.onToolbarClick, toolbar, groupId);
  };
}

export default EditorTreeController;
