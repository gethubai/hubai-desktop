import React, { memo } from 'react';
import {
  Breadcrumb,
  IBreadcrumbItemProps,
} from '@hubai/core/esm/components/breadcrumb';
import { groupBreadcrumbClassName } from './base';

export interface IEditorBreadcrumbProps {
  breadcrumbs?: IBreadcrumbItemProps[];
}

function EditorBreadcrumb(props: IEditorBreadcrumbProps) {
  const { breadcrumbs = [] } = props;
  return (
    <div className={groupBreadcrumbClassName}>
      <Breadcrumb role="breadcrumb" routes={breadcrumbs} />
    </div>
  );
}

export default memo(EditorBreadcrumb);
