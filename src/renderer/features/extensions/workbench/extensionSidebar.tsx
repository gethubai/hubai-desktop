import React, { useMemo } from 'react';
import { Content, Header, localize } from '@hubai/core';
import { Toolbar } from '@hubai/core/esm/components';

import { LocalPackageTree } from 'renderer/components/localPackageTree';
import { IExtensionListController } from '../controllers/type';
import { IExtensionListState } from '../models/extension';

export interface IExtensionSidebarProps
  extends IExtensionListController,
    IExtensionListState {}

function ExtensionSidebar({
  headerToolBar,
  extensions,
  onExtensionClick,
  onContextMenuClick,
}: IExtensionSidebarProps) {
  const contextMenu = useMemo(
    () => [
      {
        id: 'remove',
        name: localize('packageList.menu.uninstall', 'Uninstall'),
        icon: 'x',
      },
    ],
    []
  );

  return (
    <div className="dataSource" style={{ width: '100%', height: '100%' }}>
      <Header
        title="Installed Extensions"
        toolbar={<Toolbar data={headerToolBar || []} />}
      />

      <Content>
        <LocalPackageTree
          packages={extensions}
          onContextMenuClick={onContextMenuClick!}
          onClick={onExtensionClick}
          contextMenu={contextMenu}
        />
      </Content>
    </div>
  );
}

export default ExtensionSidebar;
