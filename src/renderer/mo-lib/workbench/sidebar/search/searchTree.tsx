import React, { memo } from 'react';
import Tree, { ITreeProps } from '@hubai/core/esm/components/tree';
import { treeContentClassName } from './base';

export type SearchTreeProps = ITreeProps;

function SearchTree(props: SearchTreeProps) {
  const { data = [], onSelect, renderTitle } = props;

  return (
    <Tree
      draggable={false}
      className={treeContentClassName}
      data={data}
      renderTitle={renderTitle}
      onSelect={onSelect}
      onRightClick={(e) => e.preventDefault()}
    />
  );
}
export default memo(SearchTree);
