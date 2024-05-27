import React, { useCallback, useMemo } from 'react';
import {
  component,
  localize,
  Content,
  Header,
  getEventPosition,
} from '@hubai/core';
import { ShortcutRegisterController } from '../controllers/shortcutRegisterController';
import { ShortcutRegisterState } from '../models/sidebarState';

const { Toolbar, Collapse, Menu, useContextViewEle, TreeView } = component;

export type Props = ShortcutRegisterController & ShortcutRegisterState;

function Sidebar({
  shortcuts,
  error,
  headerToolBar,
  onContextMenuClick,
  selectOrOpenWindow,
}: Props) {
  const contextView = useContextViewEle();
  const collapseItems = shortcuts?.map(
    (item) =>
      ({
        id: item.id,
        name: item.name,
        value: item,
        fileType: 'File',
        icon: 'record-keys',
        isLeaf: true,
      }) as component.ICollapseItem
  );

  const openContextMenu = useCallback(
    (e: React.MouseEvent, selected: component.ITreeNodeItemProps) => {
      e.preventDefault();
      contextView?.show(getEventPosition(e), () => (
        <Menu
          role="menu"
          onClick={(_: any, item: component.IMenuItemProps) => {
            contextView?.hide();
            onContextMenuClick?.(item, selected.value);
          }}
          data={[
            {
              id: 'remove',
              name: localize('remove', 'Remove'),
              icon: 'x',
            },
          ]}
        />
      ));
    },
    [contextView, onContextMenuClick]
  );

  const onSelectItem = useCallback(
    (node: component.ITreeNodeItemProps<any>) => {
      if (!node.isLeaf) return;

      selectOrOpenWindow(node.value);
    },
    [selectOrOpenWindow]
  );

  const renderCollapse = useMemo<component.ICollapseItem[]>(
    () => [
      {
        id: 'shortcutRegister.list',
        name: localize('shortcutRegister.listTitle', 'Shortcuts'),
        renderPanel: () => {
          return (
            <TreeView
              data={collapseItems}
              className="shortcutTree"
              onSelect={onSelectItem}
              onRightClick={openContextMenu}
            />
          );
        },
      },
    ],
    [collapseItems, onSelectItem, openContextMenu]
  );

  return (
    <div className="container" style={{ width: '100%', height: '100%' }}>
      <Header
        title={localize('shortcutRegister.sidebarTitle', 'Shortcuts')}
        toolbar={<Toolbar data={headerToolBar ?? []} />}
      />
      <Content>
        {!error && (
          <Collapse
            data={renderCollapse}
            activePanelKeys={['shortcutRegister.list']}
          />
        )}

        {error && (
          <div className="error-container">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}
      </Content>
    </div>
  );
}

export default Sidebar;
