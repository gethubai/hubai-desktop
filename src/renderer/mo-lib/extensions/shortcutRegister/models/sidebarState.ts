import { IUserShortcut, component } from '@hubai/core';

export interface IShortcutItem extends IUserShortcut {}

export interface ShortcutRegisterState {
  headerToolBar?: component.IActionBarItemProps[];
  shortcuts: IShortcutItem[];
  error?: string;
}
