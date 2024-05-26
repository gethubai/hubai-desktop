/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useLayoutEffect, useRef } from 'react';
import { IEditor, IEditorGroup } from '@hubai/core';
import {
  IActionBarItemProps,
  Icon,
  IMenuItemProps,
  ITabProps,
  Menu,
  Toolbar,
  useContextView,
  Scrollbar,
  IScrollRef,
} from '@hubai/core/esm/components';
import { classNames } from '@hubai/core/esm/common/className';
import { getEventPosition } from '@hubai/core/esm/common/dom';
import { localize } from '@hubai/core/esm/i18n/localize';
import {
  ICollapseItem,
  HEADER_HEIGTH,
  MAX_GROW_HEIGHT,
} from '@hubai/core/esm/components/collapse';
import type { UniqueId } from '@hubai/core/esm/common/types';
import { constants } from 'mo/services/builtinService/const';
import { type IEditorTreeController } from 'mo/controllers';
import {
  editorTreeActiveItemClassName,
  editorTreeClassName,
  editorTreeCloseIconClassName,
  editorTreeFileIconClassName,
  editorTreeFileNameClassName,
  editorTreeFilePathClassName,
  editorTreeGroupClassName,
  editorTreeItemClassName,
} from './base';

// override onContextMenu
type UnionEditor = Omit<
  IEditor & IEditorTreeController,
  'onContextMenu' | 'initView'
>;
export interface IOpenEditProps extends UnionEditor {
  /**
   * Group Header toolbar
   */
  groupToolbar?: IActionBarItemProps<IEditorGroup>[];
  /**
   * Item context menus
   */
  contextMenu?: IMenuItemProps[];
  /**
   * Group Header context menus
   * It'll use the value of contextMenu if specify contextMenu but not specify headerContextMenu
   */
  headerContextMenu?: IMenuItemProps[];
  onContextMenu?: (
    menu: IMenuItemProps,
    groupId: UniqueId,
    file?: ITabProps
  ) => void;
  panel: ICollapseItem;
}

function EditorTree(props: IOpenEditProps) {
  const {
    current,
    groups,
    groupToolbar,
    contextMenu = [],
    headerContextMenu,
    panel,
    onSelect,
    onSaveGroup,
    onContextMenu,
    onCloseGroup,
    onClose,
    onToolbarClick,
  } = props;

  const wrapper = useRef<HTMLDivElement>(null);
  const scrollable = useRef<IScrollRef>(null);

  // scroll into view
  useLayoutEffect(() => {
    const scrollHeight = scrollable.current?.scrollHeight || 0;
    if (scrollHeight > MAX_GROW_HEIGHT - HEADER_HEIGTH) {
      const activeItem = wrapper.current?.querySelector<HTMLDivElement>(
        `.${editorTreeActiveItemClassName}`
      );
      if (activeItem) {
        const top = activeItem.offsetTop;
        scrollable.current?.scrollTo(top);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id && current.tab?.id]);

  if (!groups || !groups.length) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contextView = useContextView();

  const handleCloseClick = (group: IEditorGroup, file: ITabProps) => {
    onClose?.(file.id!, group.id!);
  };

  const handleItemClick = (group: IEditorGroup, file: ITabProps) => {
    if (group.id !== current?.id || file.id !== current?.tab?.id) {
      onSelect?.(file.id!, group.id!);
    }
  };

  const handleOnMenuClick = (
    menu: IMenuItemProps,
    group: IEditorGroup,
    file?: ITabProps
  ) => {
    contextView.hide();
    onContextMenu?.(menu, group.id!, file);
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    group: IEditorGroup,
    file: ITabProps
  ) => {
    e.preventDefault();
    contextView.show(getEventPosition(e), () => (
      <Menu
        role="menu"
        onClick={(_: any, item: any) => handleOnMenuClick(item!, group, file)}
        data={contextMenu}
      />
    ));
  };

  const handleHeaderRightClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    group: IEditorGroup
  ) => {
    e.preventDefault();
    const groupHeaderContext = headerContextMenu || contextMenu;
    contextView.show(getEventPosition(e), () => (
      <Menu
        role="menu"
        onClick={(_: any, item: any) => handleOnMenuClick(item!, group)}
        data={groupHeaderContext}
      />
    ));
  };

  // click group title will open the first file in this group
  const handleGroupClick = (e: any, group: IEditorGroup) => {
    const { target } = e;
    const firstFile = group.data?.[0];
    if (target.nextElementSibling && firstFile) {
      onSelect?.(firstFile.id!, group.id!);
      target.nextElementSibling.focus();
    }
  };

  const handleToolBarClick = (
    e: React.MouseEvent<Element, MouseEvent>,
    item: IActionBarItemProps,
    group: IEditorGroup
  ) => {
    e.stopPropagation();
    switch (item.id) {
      case constants.EXPLORER_TOGGLE_CLOSE_GROUP_EDITORS:
        onCloseGroup?.(group.id!);
        break;
      case constants.EXPLORER_TOGGLE_SAVE_GROUP:
        onSaveGroup?.(group.id!);
        break;
      default:
        // default behavior
        onToolbarClick?.(item, group.id!);
        break;
    }
  };

  return (
    <Scrollbar ref={scrollable} isShowShadow>
      <div
        className={editorTreeClassName}
        ref={wrapper}
        data-content={panel.id}
      >
        {groups.map((group, index) => {
          return (
            <React.Fragment key={index}>
              {groups.length !== 1 && (
                <div
                  className={editorTreeGroupClassName}
                  onClick={(e) => handleGroupClick(e, group)}
                  onContextMenu={(e) => handleHeaderRightClick(e, group)}
                  key={index}
                >
                  {localize(
                    'sidebar.explore.openEditor.group',
                    'Group',
                    (index + 1).toString()
                  )}
                  {groupToolbar && (
                    <Toolbar
                      data={groupToolbar}
                      onClick={(e, item) => handleToolBarClick(e, item, group)}
                    />
                  )}
                </div>
              )}
              {group.data?.map((file) => {
                const isActive =
                  group.id === current?.id && file.id === current?.tab?.id;
                return (
                  <div
                    title={file.data?.path && `${file.data?.path}/${file.name}`}
                    className={classNames(
                      editorTreeItemClassName,
                      isActive && editorTreeActiveItemClassName
                    )}
                    tabIndex={0}
                    key={`${index}_${file.id}`}
                    onClick={() => handleItemClick(group, file)}
                    onContextMenu={(e) => handleRightClick(e, group, file)}
                  >
                    <Icon
                      className={editorTreeCloseIconClassName}
                      onClick={() => handleCloseClick(group, file)}
                      type="close"
                    />
                    <Icon
                      className={editorTreeFileIconClassName}
                      type={file.data?.icon || file.icon}
                    />
                    <span className={editorTreeFileNameClassName}>
                      {file.name}
                    </span>
                    <span className={editorTreeFilePathClassName}>
                      {file.data?.path}
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </Scrollbar>
  );
}

export { EditorTree };
