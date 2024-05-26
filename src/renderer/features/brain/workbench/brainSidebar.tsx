import { useMemo } from 'react';
import { Content, Header } from '@hubai/core/esm/workbench';
import { Toolbar } from '@hubai/core/esm/components';
import { localize } from '@hubai/core';
import { LocalPackageTree } from 'renderer/components/localPackageTree';
import { IBrainController } from '../controllers/type';
import { IBrainState } from '../models/brain';

export interface IBrainSidebarProps extends IBrainController, IBrainState {}

function BrainSidebar({
  headerToolBar,
  brains,
  onBrainClick,
  onContextMenuClick,
}: IBrainSidebarProps) {
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
    <div className="container" style={{ width: '100%', height: '100%' }}>
      <Header
        title="Installed Brains (IA)"
        toolbar={<Toolbar data={headerToolBar || []} />}
      />
      <Content>
        <LocalPackageTree
          packages={brains}
          onContextMenuClick={onContextMenuClick as any}
          onClick={onBrainClick as any}
          contextMenu={contextMenu}
        />
      </Content>
    </div>
  );
}

export default BrainSidebar;
