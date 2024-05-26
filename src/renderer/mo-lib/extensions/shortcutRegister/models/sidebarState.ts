import { IUserShortcut, component } from '@hubai/core';

export type IShortcutItem = IUserShortcut;

export interface ShortcutRegisterState {
  headerToolBar?: component.IActionBarItemProps[];
  shortcuts: IShortcutItem[];
  error?: string;
}
