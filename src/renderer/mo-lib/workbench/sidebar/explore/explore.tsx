import React from 'react';
import { Collapse } from '@hubai/core/esm/components/collapse';
import { Header, Content } from '@hubai/core/esm/workbench';
import { IExplorer } from '@hubai/core/esm/model/workbench/explorer/explorer';
import { Toolbar } from '@hubai/core/esm/components/toolbar';
import { localize } from '@hubai/core/esm/i18n/localize';
// eslint-disable-next-line import/no-cycle
import { IExplorerController } from 'mo/controllers';
import { defaultExplorerClassName } from './base';

type IExplorerProps = IExplorer & IExplorerController;

export function Explorer(props: IExplorerProps): React.JSX.Element {
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
}
