import React from 'react';
import { Collapse } from '@allai/core/esm/components/collapse';
import { Header, Content } from '@allai/core/esm/workbench';
import { IExplorer } from '@allai/core/esm/model/workbench/explorer/explorer';
import { Toolbar } from '@allai/core/esm/components/toolbar';
import { localize } from '@allai/core/esm/i18n/localize';
import { IExplorerController } from 'mo/controllers';
import { defaultExplorerClassName } from './base';

type IExplorerProps = IExplorer & IExplorerController;

export const Explorer: React.FunctionComponent<IExplorerProps> = (
  props: IExplorerProps
) => {
  const {
    activePanelKeys,
    data = [],
    headerToolBar,
    onClick,
    onActionsContextMenuClick,
    onCollapseChange,
    onToolbarClick,
  } = props;
  return (
    <div className={defaultExplorerClassName}>
      <Header
        title={localize('sidebar.explore.title', 'Explorer')}
        toolbar={
          <Toolbar
            data={[headerToolBar!]}
            onClick={onClick}
            onContextMenuClick={onActionsContextMenuClick}
          />
        }
      />
      <Content>
        <Collapse
          data={data}
          activePanelKeys={activePanelKeys}
          onCollapseChange={onCollapseChange}
          onToolbarClick={onToolbarClick}
        />
      </Content>
    </div>
  );
};
