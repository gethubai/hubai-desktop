import React from 'react';

import { ISidebarService, ISidebar, ISidebarPane } from '@allai/core';
import { getBEMElement, prefixClaName } from '@allai/core/esm/common/className';

import { Controller, connect } from '@allai/core/esm/react';
import { container } from 'tsyringe';
import { ISideBarController } from 'mo/controllers/sidebar';

const defaultClassName = prefixClaName('sidebar');
const paneClassName = getBEMElement(defaultClassName, 'pane');

const sidebarService = container.resolve<ISidebarService>('ISidebarService');
const sidebarController =
  container.resolve<ISideBarController>('ISidebarController');

export function Sidebar(props: ISidebar) {
  const { panes = [], current } = props;

  const sidebarPane: React.ReactNode = panes?.map((pane: ISidebarPane) => {
    return (
      <div
        key={pane.id}
        data-id={pane.id}
        style={{
          visibility: pane.id === current ? 'visible' : 'hidden',
          zIndex: pane.id === current ? 1 : -1,
        }}
        className={paneClassName}
      >
        {pane.render ? pane.render() : null}
      </div>
    );
  });

  return <div className={defaultClassName}>{sidebarPane}</div>;
}

export default connect(
  sidebarService,
  Sidebar,
  sidebarController as Controller
);
