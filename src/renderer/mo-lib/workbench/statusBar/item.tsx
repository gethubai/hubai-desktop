import React from 'react';
import { classNames } from '@hubai/core/esm/common/className';
import { IStatusBarItem } from '@hubai/core/esm/model/workbench/statusBar';
import { getDataAttributionsFromProps } from '@hubai/core/esm/common/dom';
import { type IStatusBarController } from 'mo/controllers';
import { itemClassName } from './base';

export function StatusItem(props: IStatusBarItem & IStatusBarController) {
  const {
    className,
    onClick,
    id,
    name,
    data,
    render,
    style,
    role,
    title,
    ...restProps
  } = props;
  const clsName = classNames(itemClassName, className);
  const events = {
    onClick(e: React.MouseEvent) {
      onClick?.(e, props);
    },
  };

  const attrProps = getDataAttributionsFromProps(restProps);

  return (
    <div
      className={clsName}
      style={style}
      role={role}
      title={title}
      id={id.toString()}
      {...attrProps}
    >
      <a tabIndex={-1} title={name} {...events}>
        {render ? render(props) : name}
      </a>
    </div>
  );
}
