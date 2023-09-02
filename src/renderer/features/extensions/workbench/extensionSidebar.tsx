import React, { useCallback } from 'react';
import { ICollapseItem } from '@hubai/core/esm/components/collapse';
import Tree from '@hubai/core/esm/components/tree';
import { Content, Header, getEventPosition, localize } from '@hubai/core';
import {
  Toolbar,
  Collapse,
  useContextViewEle,
  Menu,
  type ITreeNodeItemProps,
  type IMenuItemProps,
} from '@hubai/core/esm/components';
import { IExtensionListController } from '../controllers/type';
import {
  LocalExtensionViewModel,
  IExtensionListState,
} from '../models/extension';

export interface IExtensionSidebarProps
  extends IExtensionListController,
    IExtensionListState {}

function ExtensionSidebar({
  headerToolBar,
  extensions,
  onExtensionClick,
  onContextMenuClick,
}: IExtensionSidebarProps) {
  const contextView = useContextViewEle();

  const openContextMenu = useCallback(
    (e: React.MouseEvent, selected: ITreeNodeItemProps) => {
      e.preventDefault();
      contextView?.show(getEventPosition(e), () => (
        <Menu
          role="menu"
          onClick={(_: any, item: IMenuItemProps) => {
            contextView?.hide();
            onContextMenuClick?.(item, selected.extension);
          }}
          data={[
            {
              id: 'remove',
              name: localize('packageList.menu.uninstall', 'Uninstall'),
              icon: 'x',
            },
          ]}
        />
      ));
    },
    [contextView, onContextMenuClick]
  );

  const collapseItems = extensions?.map(
    (extension) =>
      ({
        id: extension.id,
        name: extension.displayName,
        fileType: 'File',
        icon: 'project',
        isLeaf: true,
        extension,
      } as ICollapseItem)
  );

  const renderCollapse = (): ICollapseItem[] => {
    return [
      {
        id: 'ExtensionList',
        name: 'Extensions',
        renderPanel: () => {
          return (
            <Tree
              data={collapseItems}
              onSelect={(node) => {
                if (!node.isLeaf) return;
                onExtensionClick?.(node.extension as LocalExtensionViewModel);
              }}
              onRightClick={openContextMenu}
            />
          );
        },
      },
    ];
  };

  return (
    <div className="dataSource" style={{ width: '100%', height: '100%' }}>
      <Header
        title="Installed Extensions"
        toolbar={<Toolbar data={headerToolBar || []} />}
      />
      <Content>
        <Collapse data={renderCollapse()} activePanelKeys={['ExtensionList']} />
      </Content>
    </div>
  );
}

export default ExtensionSidebar;
