import React, { memo } from 'react';
import SplitPane from '@allai/core/esm/components/split';
import Pane from '@allai/core/esm/components/split/pane';
import { IEditor, IEditorGroup } from '@allai/core/esm/model';

import { IEditorController } from '@allai/core/esm/controller/editor';
import type { UniqueId } from '@allai/core/esm/common/types';
import { ILayout } from '@allai/core/esm/model/workbench/layout';
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
      onMoveTab: (tabs) => onMoveTab?.(tabs, groupId),
      onCloseTab: (tabKey) => onCloseTab?.(tabKey, groupId),
      onSelectTab: (tabKey) => onSelectTab?.(tabKey, groupId),
      onClickActions,
      onUpdateEditorIns,
      onChangeEditorProps,
      onClickContextMenu,
    };
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
            <Pane key={`group-${index}${g.id}`} minSize="220px">
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
