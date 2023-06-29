import React, { useCallback, useEffect } from 'react';
import { IStatusBar, IStatusBarController, IStatusBarItem } from '@allai/core';
import {
  IMenuItemProps,
  Menu,
  useContextMenu,
} from '@allai/core/esm/components';
import { mergeFunctions } from '@allai/core/esm/common/utils';
import { select } from '@allai/core/esm/common/dom';
import { ID_STATUS_BAR } from '@allai/core/esm/common/id';
import {
  leftItemsClassName,
  rightItemsClassName,
  sortByIndex,
  statusBarClassName,
} from './base';
import { StatusItem } from './item';

function StatusBar(props: IStatusBar & IStatusBarController) {
  const {
    leftItems = [],
    contextMenu = [],
    onContextMenuClick,
    onClick,
    rightItems = [],
  } = props;

  let contextViewMenu: any;
  const onClickMenuItem = useCallback(
    (e: React.MouseEvent, item: IMenuItemProps | undefined) => {
      onContextMenuClick?.(e, item);
      contextViewMenu?.dispose();
    },
    [contextMenu]
  );
  const renderContextMenu = () => (
    <Menu role="menu" onClick={onClickMenuItem} data={contextMenu} />
  );
  useEffect(() => {
    if (contextMenu.length > 0) {
      contextViewMenu = useContextMenu({
        anchor: select(`#${ID_STATUS_BAR}`),
        render: renderContextMenu,
      });
    }
    return function cleanup() {
      contextViewMenu?.dispose();
    };
  });

  const renderItems = (data: IStatusBarItem[]) => {
    return data
      .sort(sortByIndex)
      .map((item: IStatusBarItem) => (
        <StatusItem
          key={item.id}
          {...item}
          onClick={mergeFunctions(item.onClick, onClick)}
        />
      ));
  };

  return (
    <div className={statusBarClassName} id={ID_STATUS_BAR}>
      <div className={leftItemsClassName}>{renderItems(leftItems)}</div>
      <div className={rightItemsClassName}>{renderItems(rightItems)}</div>
    </div>
  );
}

export default StatusBar;
