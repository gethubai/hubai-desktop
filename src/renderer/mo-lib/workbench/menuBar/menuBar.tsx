import React, { useCallback, useEffect, useRef } from 'react';
import { getBEMElement, prefixClaName } from '@allai/core/esm/common/className';
import {
  IMenuBar,
  IMenuBarItem,
} from '@allai/core/esm/model/workbench/menuBar';
import { DropDown, DropDownRef } from '@allai/core/esm/components/dropdown';
import { IMenuProps, Menu } from '@allai/core/esm/components/menu';
import { Icon } from '@allai/core/esm/components/icon';
import { KeybindingHelper } from '@allai/core/esm/services/keybinding';
import { MenuBarMode } from '@allai/core/esm/model/workbench/layout';
import { IMenuBarController } from 'mo/controllers';
import { HorizontalView } from './horizontalView';

export const defaultClassName = prefixClaName('menuBar');
export const actionClassName = getBEMElement(defaultClassName, 'action');

export function MenuBar(props: IMenuBar & IMenuBarController) {
  const {
    data,
    mode = MenuBarMode.vertical,
    onClick,
    updateFocusinEle,
    logo,
  } = props;
  const childRef = useRef<DropDownRef>(null);

  const addKeybindingForData = (rawData: IMenuBarItem[] = []): IMenuProps[] => {
    const resData: IMenuProps[] = rawData.concat();
    const stack = [...resData];
    while (stack.length) {
      const head = stack.pop();
      if (head) {
        if (head?.data) {
          stack.push(...head.data);
        } else {
          const simplyKeybinding =
            KeybindingHelper.queryGlobalKeybinding(head.id!) || [];
          if (simplyKeybinding.length) {
            head.keybinding =
              KeybindingHelper.convertSimpleKeybindingToString(
                simplyKeybinding
              );
          }
        }
      }
    }
    return resData;
  };

  const handleClick = (e: React.MouseEvent, item: IMenuBarItem) => {
    onClick?.(e, item);
    childRef.current!.dispose();
  };

  const overlay = (
    <Menu
      role="menu"
      onClick={handleClick}
      style={{ width: 200 }}
      data={addKeybindingForData(data)}
    />
  );

  const handleSaveFocusinEle = useCallback((e: FocusEvent) => {
    updateFocusinEle?.(e.target as HTMLElement | null);
  }, []);

  useEffect(() => {
    document.body.addEventListener('focusin', handleSaveFocusinEle);
    return () => {
      document.body.removeEventListener('focusin', handleSaveFocusinEle);
    };
  }, []);

  if (mode === MenuBarMode.horizontal) {
    return (
      <HorizontalView
        data={addKeybindingForData(data)}
        onClick={onClick}
        logo={logo}
      />
    );
  }

  return (
    <div className={defaultClassName}>
      <DropDown
        ref={childRef}
        trigger="click"
        className={actionClassName}
        placement="right"
        overlay={overlay}
      >
        <Icon type="menu" />
      </DropDown>
    </div>
  );
}

export default MenuBar;
