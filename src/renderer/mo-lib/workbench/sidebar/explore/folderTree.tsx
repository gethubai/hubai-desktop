/* eslint-disable react/function-component-definition */
import 'reflect-metadata';
import React, { memo, useRef, useEffect, useLayoutEffect } from 'react';
import {
  UniqueId,
  type IFolderTree,
  type IFolderTreeNodeProps,
} from '@hubai/core';
import { select, getEventPosition } from '@hubai/core/esm/common/dom';
import Tree, { type ITreeProps } from '@hubai/core/esm/components/tree';
import { type IMenuItemProps, Menu } from '@hubai/core/esm/components/menu';
import { Button } from '@hubai/core/esm/components/button';
import { useContextMenu } from '@hubai/core/esm/components/contextMenu';
import { classNames } from '@hubai/core/esm/common/className';
import { Scrollbar, useContextViewEle } from '@hubai/core/esm/components';
import { type ICollapseItem } from '@hubai/core/esm/components/collapse';
import { type IFolderTreeController } from 'mo/controllers';
import {
  folderTreeClassName,
  folderTreeEditClassName,
  folderTreeInputClassName,
} from './base';

export interface IFolderTreeProps extends IFolderTreeController, IFolderTree {
  panel: ICollapseItem;
}

const detectHasEditableStatus = (data: any) => {
  const stack = [...data];
  let res = false;
  while (stack.length) {
    const headElm = stack.pop();
    if (headElm?.isEditable) {
      res = true;
      break;
    } else {
      stack.push(...(headElm?.children || []));
    }
  }
  return res;
};

/**
 * A simple wrapper Input, achieve autoFucus & auto select file name
 */
const Input = React.forwardRef(
  (
    // same as raw input
    props: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useLayoutEffect(() => {
      if (inputRef.current) {
        // eslint-disable-next-line react/prop-types
        const ext = ((props.defaultValue || '') as string).lastIndexOf('.');
        inputRef.current.selectionStart = 0;
        inputRef.current.selectionEnd =
          // if period at position of 0, then this period means hidden file
          // eslint-disable-next-line react/prop-types
          ext > 0 ? ext : ((props.defaultValue || '') as string).length;
      }
      // eslint-disable-next-line react/prop-types
    }, [props.defaultValue]);
    return <input {...props} ref={inputRef} />;
  }
);

const FolderTree: React.FunctionComponent<IFolderTreeProps> = (props) => {
  const {
    folderTree = {},
    entry,
    panel,
    onUpdateFileName,
    onSelectFile,
    onDropTree,
    onClickContextMenu,
    onRightClick,
    onLoadData,
    createTreeNode,
    onExpandKeys,
    ...restProps
  } = props;

  const {
    data = [],
    folderPanelContextMenu = [],
    expandKeys,
    loadedKeys,
    current,
  } = folderTree;

  const inputRef = useRef<HTMLInputElement>(null);
  // tree context view
  const contextMenu = useRef<ReturnType<typeof useContextMenu>>();

  // panel context view
  const contextView = useContextViewEle();

  // to detect current tree whether is editable
  const hasEditable = detectHasEditableStatus(data);

  const onClickMenuItem = (_: any, item: any) => {
    onClickContextMenu?.(item);
    contextMenu.current?.hide();
  };

  // init context menu
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initContextMenu = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useContextMenu({
      anchor: select(`.${folderTreeClassName}`),
      render: () => (
        <Menu
          role="menu"
          onClick={onClickMenuItem}
          data={folderPanelContextMenu}
        />
      ),
    });
  };

  const handleMenuClick = (
    item: IMenuItemProps,
    eventData: IFolderTreeNodeProps
  ) => {
    onClickContextMenu?.(item, eventData);
    contextView?.hide();
  };

  const handleRightClick: ITreeProps['onRightClick'] = (event, eventData) => {
    if ((event.target as HTMLElement).nodeName !== 'INPUT') {
      event.preventDefault();
      const menuItems = onRightClick?.(eventData) || [];

      if (!menuItems.length) return;

      contextView?.show(getEventPosition(event), () => (
        <Menu
          role="menu"
          onClick={(_: any, item: any) => handleMenuClick(item, eventData)}
          data={menuItems}
        />
      ));
    }
  };

  const handleUpdateFile = (
    e: HTMLInputElement,
    node: IFolderTreeNodeProps
  ) => {
    const newName = e.value;
    onUpdateFileName?.({
      ...node,
      name: newName,
    });
  };

  /**
   * update file info when input blur
   */
  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    node: IFolderTreeNodeProps
  ) => {
    handleUpdateFile(e.target, node);
  };

  /**
   * update file info when press `Enter` or `esc`
   */
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    node: IFolderTreeNodeProps
  ) => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      handleUpdateFile(e.target as EventTarget & HTMLInputElement, node);
    }
  };

  const renderTitle = (node: IFolderTreeNodeProps) => {
    const { isEditable, name } = node;

    return isEditable ? (
      <Input
        role="textbox"
        className={folderTreeInputClassName}
        type="text"
        defaultValue={name}
        ref={inputRef}
        onKeyDown={(e) => handleInputKeyDown(e, node)}
        autoComplete="off"
        autoFocus
        onBlur={(e) => handleInputBlur(e, node)}
        onClick={(e) => e.stopPropagation()}
      />
    ) : (
      name?.toString()
    );
  };

  const handleTreeClick = () => {
    onSelectFile?.();
  };

  const handleDropTree = (source: any, target: any) => {
    onDropTree?.(source, target);
  };

  const handleAddRootFolder = () => {
    createTreeNode?.('RootFolder');
  };

  useEffect(() => {
    if (folderPanelContextMenu.length > 0) {
      contextMenu.current = initContextMenu();
    }
    return () => {
      contextMenu.current?.dispose();
    };
  }, [data.length, folderPanelContextMenu.length, initContextMenu]);

  const welcomePage = (
    <div data-content={panel.id}>
      {entry || (
        <div style={{ padding: '10px 5px' }}>
          you have not yet opened a folder
          <Button onClick={handleAddRootFolder}>Add Folder</Button>
        </div>
      )}
    </div>
  );

  if (!data.length) return welcomePage;

  return (
    <Scrollbar isShowShadow>
      <div data-content={panel.id} style={{ height: '100%' }}>
        <Tree
          // root folder do not render
          activeKey={current?.id}
          expandKeys={expandKeys}
          loadedKeys={loadedKeys}
          data={data[0]?.children || []}
          className={classNames(
            folderTreeClassName,
            hasEditable && folderTreeEditClassName
          )}
          draggable={!hasEditable}
          onDropTree={handleDropTree}
          onSelect={onSelectFile}
          onTreeClick={handleTreeClick}
          onRightClick={handleRightClick}
          renderTitle={renderTitle as any}
          onLoadData={onLoadData}
          onExpand={(keys) => {
            onExpandKeys?.(keys as UniqueId[]);
          }}
          {...restProps}
        />
      </div>
    </Scrollbar>
  );
};
export default memo(FolderTree);
