import React from 'react';
import { classNames } from '@hubai/core/esm/common/className';
import { IActivityBarItem } from '@hubai/core/esm/model/workbench/activityBar';
import { IMenuItemProps, Menu } from '@hubai/core/esm/components/menu';
import { IActivityBarController } from 'mo/controllers';

import { Icon, Tooltip, useContextViewEle } from '@hubai/core/esm/components';
import { KeybindingHelper } from '@hubai/core/esm/services/keybinding';
import {
  indicatorClassName,
  labelClassName,
  itemClassName,
  itemCheckedClassName,
  itemDisabledClassName,
} from './base';

export function ActivityBarItem(
  props: IActivityBarItem & IActivityBarController
) {
  const {
    checked = false,
    disabled = false,
    title = '',
    data = {},
    render,
    icon,
    id,
    onClick,
    contextMenu = [],
    className,
    onContextMenuClick,
  } = props;

  const renderContextMenu = () => (
    <Menu
      // eslint-disable-next-line no-use-before-define
      onClick={onClickMenuItem}
      role="menu"
      data={contextMenu.map((menu) => {
        if (menu.id) {
          const keybindingObj = KeybindingHelper.queryGlobalKeybinding(
            menu.id.toString()
          );
          if (keybindingObj) {
            menu.keybinding =
              KeybindingHelper.convertSimpleKeybindingToString(keybindingObj);
          }
        }
        return menu;
      })}
    />
  );

  const contextView = useContextViewEle({ render: renderContextMenu });

  const onClickMenuItem = (
    e: React.MouseEvent,
    item: IMenuItemProps | undefined
  ) => {
    onContextMenuClick?.(e, item);
    contextView?.hide();
  };

  const onClickItem = (event: any) => {
    if (onClick) {
      onClick(props.id, props);
    }
    if (contextMenu.length > 0) {
      contextView?.show({ x: event.pageX, y: event.pageY });
    }
  };

  const content = (
    <Icon type={icon} className={labelClassName} title={title}>
      {render?.() || null}
    </Icon>
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <li
      data-id={data.id}
      className={classNames(
        className,
        itemClassName,
        checked ? itemCheckedClassName : '',
        disabled ? itemDisabledClassName : ''
      )}
      id={id.toString()}
      onClick={onClickItem}
    >
      <Tooltip overlay={title} key={id} placement="right">
        {content}
      </Tooltip>
      {checked ? <div className={indicatorClassName} /> : null}
    </li>
  );
}
