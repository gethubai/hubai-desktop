import React from 'react';
import type { IAuxiliaryBar } from '@allai/core/esm/model';
import { containerClassName } from '@allai/core/esm/workbench/auxiliaryBar/base';

export default function AuxiliaryBar({ children }: IAuxiliaryBar) {
  return <div className={containerClassName}>{children}</div>;
}
