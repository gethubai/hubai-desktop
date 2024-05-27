import React, { memo } from 'react';
import SplitPane from '@hubai/core/esm/components/split';
import Pane from '@hubai/core/esm/components/split/pane';
import { IEditor, IEditorGroup, IEditorTab } from '@hubai/core/esm/model';

import type { UniqueId } from '@hubai/core/esm/common/types';
import { ILayout } from '@hubai/core/esm/model/workbench/layout';
import { type IEditorController } from 'mo/controllers';
import Welcome from './welcome';
import { EditorGroup } from './group';
import { defaultEditorClassName } from './base';

export function Editor(
  props: { editor?: IEditor; layout?: ILayout } & IEditorController
) {
  const {
    onClickContextMenu,
    onCloseTab,
    onMoveTab,
    onSelectTab,
    onChangeEditorProps,
    onClickActions,
    onUpdateEditorIns,
    onPaneSizeChange,
    editor,
    layout,
  } = props;
  const {
    groups = [],
    current,
    entry = <Welcome />,
    editorOptions,
  } = editor || {};
  const { groupSplitPos, editorGroupDirection } = layout || {};

  const getEvents = (groupId: UniqueId) => {
    return {
      onMoveTab: (tabs: IEditorTab<any>[]) => onMoveTab?.(tabs, groupId),
      onCloseTab: (tabKey: UniqueId) => onCloseTab?.(tabKey, groupId),
      onSelectTab: (tabKey: UniqueId) => onSelectTab?.(tabKey, groupId),
      onClickActions,
      onUpdateEditorIns,
      onChangeEditorProps,
      onClickContextMenu,
    };
  };

  const getGroupPaneKey = (index: number, id: UniqueId) => {
    return `group-${index}-${id}`;
  };

  const renderGroups = () => {
    if (groups.length === 1) {
      return (
        <EditorGroup
          editorOptions={editorOptions}
          currentGroup={current!}
          group={groups[0]}
          {...groups[0]}
          {...getEvents(groups[0].id!)}
        />
      );
    }
    if (groups.length > 1) {
      return (
        <SplitPane
          sizes={groupSplitPos!}
          split={editorGroupDirection}
          onChange={onPaneSizeChange!}
        >
          {groups.map((g: IEditorGroup, index: number) => (
            <Pane key={getGroupPaneKey(index, g.id)} minSize="220px">
              <EditorGroup
                editorOptions={editorOptions}
                currentGroup={current!}
                group={g}
                {...g}
                {...getEvents(g.id!)}
              />
            </Pane>
          ))}
        </SplitPane>
      );
    }
    return null;
  };

  return (
    <div className={defaultEditorClassName}>
      {current ? renderGroups() : entry}
    </div>
  );
}

export default memo(Editor);
