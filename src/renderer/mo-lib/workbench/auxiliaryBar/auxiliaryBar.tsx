import React from 'react';
import type { IAuxiliaryBar } from '@hubai/core/esm/model';
import { containerClassName } from './base';

export default function AuxiliaryBar({ children }: IAuxiliaryBar) {
  return <div className={containerClassName}>{children}</div>;
}
