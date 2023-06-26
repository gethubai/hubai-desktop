import React from 'react';
import { classNames } from '@allai/core/esm/common/className';
import type { IAuxiliaryBar } from '@allai/core/esm/model';
import {
  tabActiveClassName,
  tabClassName,
  tabsClassName,
} from '@allai/core/esm/workbench/auxiliaryBar/base';
import { IAuxiliaryController } from 'mo/controllers';

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
