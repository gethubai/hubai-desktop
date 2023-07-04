import React from 'react';
import { classNames } from '@hubai/core/esm/common/className';
import type { IAuxiliaryBar } from '@hubai/core/esm/model';
import { IAuxiliaryController } from 'mo/controllers';
import { tabActiveClassName, tabClassName, tabsClassName } from './base';

export default function AuxiliaryBarTab({
  mode,
  data,
  current,
  onClick,
}: IAuxiliaryBar & IAuxiliaryController) {
  if (mode === 'default') return null;

  return (
    <ul className={tabsClassName}>
      {data?.map((item) => (
        <li
          key={item.key}
          className={classNames(
            tabClassName,
            current === item.key && tabActiveClassName
          )}
          onClick={() => onClick?.(item.key)}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
}
