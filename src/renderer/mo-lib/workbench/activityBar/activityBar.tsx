/* eslint-disable no-unused-expressions */
import React, { useCallback, useMemo } from 'react';

import { IActivityBarController } from 'mo/controllers';
import {
  IActivityBar,
  IActivityBarItem,
  IActivityMenuItemProps,
  type UniqueId,
} from '@hubai/core';
import { ID_ACTIVITY_BAR } from '@hubai/core/esm/common/id';
import {
  IMenuItemProps,
  Menu,
  useContextViewEle,
} from '@hubai/core/esm/components';
import {
  containerClassName,
  defaultClassName,
  globalItemsClassName,
  groupContainerClassName,
  itemClassName,
  normalItemsClassName,
} from './base';
import { ActivityBarItem } from './ActivityBarItem';

export function ActivityBar(props: IActivityBar & IActivityBarController) {
  const {
    data = [],
    contextMenu = [],
    selected,
    onClick,
    onChange,
    onContextMenuClick,
  } = props;

  const onClickBar = useCallback(
    (key: UniqueId, item: IActivityBarItem) => {
      if (onClick) onClick(key, item);
      if (onChange) {
        // only normal item trigger onChange event
        if (item.type !== 'global') {
          onChange(selected, key);
        }
      }
    },
    [onClick, onChange, selected]
  );

  const groupedItems = useMemo(
    () =>
      data
        .filter(
          (item: IActivityBarItem) => item.type !== 'global' && !item.hidden
        )
        .reduce((acc: any, item: IActivityBarItem) => {
          const type = item.type ?? 'default';
          (acc[type] ??= []).push(item);
          return acc;
        }, {}),
    [data]
  );

  const globalBarItems = useMemo(
    () =>
      data.filter(
        (item: IActivityBarItem) => item.type === 'global' && !item.hidden
      ),
    [data]
  );

  const renderItems = (item: IActivityBarItem, index: number) => {
    return (
      <ActivityBarItem
        key={item.id}
        {...item}
        onContextMenuClick={onContextMenuClick}
        onClick={onClickBar}
        data-index={index}
        checked={selected === item.id}
      />
    );
  };

  const renderContextMenu = () => (
    // eslint-disable-next-line no-use-before-define
    <Menu role="menu" onClick={onClickMenuItem} data={contextMenu} />
  );

  const contextView = useContextViewEle({ render: renderContextMenu });

  const onClickMenuItem = useCallback(
    (e: React.MouseEvent, item: IMenuItemProps | undefined) => {
      onContextMenuClick?.(e, item);
      contextView?.hide();
    },
    [onContextMenuClick, contextView]
  );

  const handleRightClick = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      if (!contextView) return;
      const doms = document.elementsFromPoint(e.pageX, e.pageY);
      const itemDom = doms.find((dom) => dom.classList.contains(itemClassName));
      if (itemDom) {
        const rect = itemDom.getBoundingClientRect();
        const extraContextMenu = contextMenu.concat();
        const targetContextMenu = contextMenu.find(
          (menu) => menu.id === itemDom?.id
        );
        targetContextMenu &&
          extraContextMenu.unshift(
            ...([
              {
                id: itemDom.id,
                icon: 'check',
                name: targetContextMenu.name,
              },
              {
                type: 'divider',
              },
            ] as IActivityMenuItemProps[])
          );
        contextView.show(
          {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height,
          },
          () => (
            <Menu
              role="menu"
              onClick={onClickMenuItem}
              data={extraContextMenu}
            />
          )
        );
      } else {
        contextView.show({ x: e.pageX, y: e.pageY });
      }
    },
    [contextMenu, contextView, onClickMenuItem]
  );

  return (
    <div
      className={defaultClassName}
      onContextMenu={handleRightClick}
      id={ID_ACTIVITY_BAR}
    >
      <div className={containerClassName}>
        <div className={groupContainerClassName}>
          {Object.keys(groupedItems).map((key) => {
            const items = groupedItems[key];
            return (
              <div className={normalItemsClassName} key={key}>
                <ul>{items.map(renderItems)}</ul>
              </div>
            );
          })}
        </div>

        <div className={globalItemsClassName}>
          <ul>{globalBarItems.map(renderItems)}</ul>
        </div>
      </div>
    </div>
  );
}

export default ActivityBar;
