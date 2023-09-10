import React, { useMemo } from 'react';

import { component, localize, Content, Header, UniqueId } from '@hubai/core';
import { Button } from '@hubai/core/esm/components';
import { PackageStoreController } from '../controllers/packageStoreController';
import { PackageStoreState } from '../models/packageStoreState';

const { Toolbar, Collapse } = component;

export type Props = PackageStoreController & PackageStoreState & {};

function Sidebar({
  headerToolBar,
  packageListCollapses,
  error,
  initSidebarData,
}: Props) {
  const renderExtensionsCollapse = useMemo<component.ICollapseItem[]>(
    () =>
      (packageListCollapses ?? []).map((collapse) => ({
        ...collapse,
        id: `packageList.${collapse.id}}`,
      })),
    [packageListCollapses]
  );

  const activePanelKeys = useMemo<UniqueId[]>(
    () => renderExtensionsCollapse.map((collapse) => collapse.id),
    [renderExtensionsCollapse]
  );

  return (
    <div className="container" style={{ width: '100%', height: '100%' }}>
      <Header
        title={localize('packageStore.sidebarTitle', 'Packages')}
        toolbar={<Toolbar data={headerToolBar || []} />}
      />
      <Content>
        {!error && (
          <Collapse
            data={renderExtensionsCollapse}
            activePanelKeys={activePanelKeys}
          />
        )}

        {error && (
          <div className="error-container">
            <h3>{localize('packageStore.error', 'Error')}</h3>
            <p>{error}</p>

            <Button onClick={initSidebarData}>
              {localize('refresh', 'Refresh')}
            </Button>
          </div>
        )}
      </Content>
    </div>
  );
}

export default Sidebar;
