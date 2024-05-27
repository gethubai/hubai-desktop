import React from 'react';
import { Controller } from '@hubai/core/esm/react/controller';
import { inject, injectable } from 'tsyringe';
import { ControllerObject, connect } from '@hubai/core/esm/react';
// eslint-disable-next-line import/no-cycle
import { Explorer, FolderTree } from 'mo/workbench/sidebar/explore';
import { IMenuItemProps } from '@hubai/core/esm/components/menu';
import {
  ExplorerEvent,
  IExplorerPanelItem,
  type IExplorerService,
  type ISidebarService,
  type IActivityBarService,
  type IFolderTreeService,
} from '@hubai/core';
import { FileTypes, EditorTreeEvent } from '@hubai/core/esm/model';
import { IActionBarItemProps } from '@hubai/core/esm/components/actionBar';
import { type IBuiltinService } from 'mo/services/builtinService';
import { type IFolderTreeController } from './folderTree';

export interface IExplorerController extends Partial<Controller> {
  onActionsContextMenuClick?: (
    e: React.MouseEvent,
    item?: IMenuItemProps
  ) => void;
  onCollapseChange?: (keys: any) => void;
  onToolbarClick?: (
    item: IActionBarItemProps,
    panel: IExplorerPanelItem
  ) => void;
  onClick?: (event: any, item: any) => void;
}

@injectable()
class ExplorerController extends Controller implements IExplorerController {
  constructor(
    @inject('ISidebarService') private sidebarService: ISidebarService,
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('IExplorerService') private explorerService: IExplorerService,
    @inject('IBuiltinService') private builtinService: IBuiltinService,
    @inject('IFolderTreeService') private folderTreeService: IFolderTreeService,
    @inject('IFolderTreeController')
    private folderTreeController: IFolderTreeController
  ) {
    super();
  }

  public initView() {
    const explorerEvent = {
      onClick: this.onClick,
      onCollapseChange: this.onCollapseChange,
      onActionsContextMenuClick: this.onActionsContextMenuClick,
      onToolbarClick: this.onToolbarClick,
    };

    const ExplorerView = connect(this.explorerService, Explorer);

    const FolderTreeViewLocal = connect(
      this.folderTreeService,
      FolderTree,
      this.folderTreeController as ControllerObject
    );

    const id = this.builtinService.getConstants().EXPLORER_ACTIVITY_ITEM;

    if (!id) return;

    const explorePane = {
      id,
      title: 'EXPLORER',
      render() {
        return <ExplorerView {...explorerEvent} />;
      },
    };
    const {
      builtInExplorerActivityItem,
      builtInExplorerFolderPanel,
      builtInExplorerHeaderToolbar,
    } = this.builtinService.getModules();

    if (builtInExplorerHeaderToolbar) {
      this.explorerService.setState({
        headerToolBar: builtInExplorerHeaderToolbar,
      });
    }

    if (builtInExplorerActivityItem && builtInExplorerFolderPanel) {
      this.activityBarService.add(builtInExplorerActivityItem, true);
      this.sidebarService.add(explorePane, true);

      // add folder panel
      this.explorerService.addPanel({
        ...builtInExplorerFolderPanel,
        renderPanel: (panel) => <FolderTreeViewLocal panel={panel} />,
      });
    }
  }

  public readonly onClick = (
    event: React.MouseEvent,
    item: IActionBarItemProps
  ) => {
    this.emit(ExplorerEvent.onClick, event, item);
  };

  public readonly onActionsContextMenuClick = (
    e: React.MouseEvent,
    item?: IMenuItemProps
  ) => {
    const panelId = item?.id;
    if (panelId) {
      this.explorerService.togglePanel(panelId);
    }
  };

  public readonly onCollapseChange = (keys: any) => {
    this.emit(ExplorerEvent.onCollapseChange, keys);
  };

  public readonly onToolbarClick = (
    item: IActionBarItemProps,
    parentPanel: IExplorerPanelItem
  ) => {
    const toolbarId = item.id;
    const {
      NEW_FILE_COMMAND_ID,
      NEW_FOLDER_COMMAND_ID,
      REMOVE_COMMAND_ID,
      COLLAPSE_COMMAND_ID,
      EXPLORER_TOGGLE_CLOSE_ALL_EDITORS,
      EXPLORER_TOGGLE_SAVE_ALL,
      EXPLORER_TOGGLE_VERTICAL,
    } = this.builtinService.getConstants();

    switch (toolbarId) {
      case NEW_FILE_COMMAND_ID: {
        this.folderTreeController.createTreeNode?.(FileTypes.File);
        break;
      }
      case NEW_FOLDER_COMMAND_ID: {
        this.folderTreeController.createTreeNode?.(FileTypes.Folder);
        break;
      }
      case REMOVE_COMMAND_ID: {
        this.emit(ExplorerEvent.onRemovePanel, parentPanel);
        break;
      }
      case COLLAPSE_COMMAND_ID: {
        this.emit(ExplorerEvent.onCollapseAllFolders);
        break;
      }
      case EXPLORER_TOGGLE_CLOSE_ALL_EDITORS: {
        this.emit(EditorTreeEvent.onCloseAll);
        break;
      }
      case EXPLORER_TOGGLE_SAVE_ALL: {
        this.emit(EditorTreeEvent.onSaveAll);
        break;
      }
      case EXPLORER_TOGGLE_VERTICAL: {
        this.emit(EditorTreeEvent.onSplitEditorLayout);
        break;
      }
      default:
        this.emit(ExplorerEvent.onPanelToolbarClick, parentPanel, toolbarId);
    }
  };
}

export default ExplorerController;
