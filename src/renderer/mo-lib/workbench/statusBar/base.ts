import { getBEMElement, prefixClaName } from '@hubai/core/esm/common/className';
import { IStatusBarItem } from '@hubai/core/esm/model';

export const statusBarClassName = prefixClaName('statusBar');
export const leftItemsClassName = getBEMElement(
  statusBarClassName,
  'left-items'
);
export const rightItemsClassName = getBEMElement(
  statusBarClassName,
  'right-items'
);
export const itemClassName = getBEMElement(statusBarClassName, 'item');

export function sortByIndex(a: IStatusBarItem, b: IStatusBarItem) {
  return a.sortIndex !== undefined && b.sortIndex !== undefined
    ? a.sortIndex - b.sortIndex
    : 0;
}
