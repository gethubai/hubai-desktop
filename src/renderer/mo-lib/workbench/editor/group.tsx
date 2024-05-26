import { MonacoEditor } from '@hubai/core/esm/components/monaco';
import { Tabs } from '@hubai/core/esm/components/tabs';
import { IEditorController } from 'mo/controllers';
import { IEditorGroup, IEditorOptions } from '@hubai/core';
import React, { memo, useEffect } from 'react';
import { Menu } from '@hubai/core/esm/components/menu';
import { useContextView } from '@hubai/core/esm/components/contextView';
import { getEventPosition } from '@hubai/core/esm/common/dom';
import EditorBreadcrumb from './breadcrumb';
import EditorAction from './action';
import {
  groupClassName,
  groupContainerClassName,
  groupHeaderClassName,
  groupTabsClassName,
} from './base';

export interface IEditorGroupProps extends IEditorGroup {
  currentGroup?: IEditorGroup;
  editorOptions?: IEditorOptions;
  group?: IEditorGroup;
}

export function EditorGroup(props: IEditorGroupProps & IEditorController) {
  const {
    id,
    data,
    tab,
    currentGroup,
    group,
    actions = [],
    menu = [],
    onMoveTab,
    onCloseTab,
    onClickContextMenu,
    onChangeEditorProps,
    onSelectTab,
    onClickActions,
    editorOptions,
    onUpdateEditorIns,
  } = props;

  const isActiveGroup = id === currentGroup?.id;

  const contextView = useContextView();

  const handleTabContextMenu = (e: React.MouseEvent, tabItem: any) => {
    const handleOnMenuClick = (event: React.MouseEvent, item: any) => {
      onClickContextMenu?.(event, item, tabItem);
      contextView.hide();
    };

    contextView?.show(getEventPosition(e), () => (
      <Menu data={menu} onClick={handleOnMenuClick} />
    ));
  };

  useEffect(() => {
    return function cleanup() {
      contextView?.dispose();
    };
  });

  const renderPane = (renderTab: any) => {
    if (typeof renderTab.renderPane === 'function') {
      return renderTab.renderPane(
        {
          ...renderTab.data,
        },
        renderTab,
        group
      );
    }

    return renderTab.renderPane;
  };

  return (
    <div className={groupClassName}>
      <div className={groupHeaderClassName}>
        <div className={groupTabsClassName}>
          <Tabs
            type="card"
            data={data}
            onMoveTab={onMoveTab}
            onSelectTab={onSelectTab}
            onContextMenu={handleTabContextMenu}
            activeTab={isActiveGroup ? tab?.id : ''}
            onCloseTab={onCloseTab}
          />
        </div>
        <EditorAction
          isActiveGroup={isActiveGroup}
          actions={actions}
          menu={menu}
          onClickActions={onClickActions}
        />
      </div>
      <EditorBreadcrumb breadcrumbs={tab?.breadcrumb || []} />
      <div className={groupContainerClassName}>
        {
          // Default we use monaco editor, but also you can customize by renderPanel() function or a react element
          tab?.renderPane ? (
            renderPane(tab)
          ) : (
            <MonacoEditor
              options={{
                ...editorOptions,
                value: tab?.data?.value,
                language: tab?.data?.language,
                automaticLayout: true,
              }}
              path={tab?.id.toString()}
              editorInstanceRef={(editorInstance) => {
                // This assignment will trigger moleculeCtx update, and subNodes update
                onUpdateEditorIns?.(editorInstance, id!);
              }}
              onChangeEditorProps={(preProps, newProps) => {
                // Listener event for Editor property update
                onChangeEditorProps?.(preProps, newProps);
              }}
            />
          )
        }
      </div>
    </div>
  );
}

export default memo(EditorGroup);
