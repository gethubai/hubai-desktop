import { Controller } from '@hubai/core';
import { IMenuItemProps } from '@hubai/core/esm/components';
import { LocalExtensionViewModel } from '../models/extension';

export interface IExtensionListController extends Partial<Controller> {
  onExtensionClick?: (item: LocalExtensionViewModel) => void;
  onSaveSettings?: (
    extension: LocalExtensionViewModel,
    extensionSettings: any
  ) => void;
  onContextMenuClick?: (
    menu: IMenuItemProps,
    item: LocalExtensionViewModel
  ) => void;
}
