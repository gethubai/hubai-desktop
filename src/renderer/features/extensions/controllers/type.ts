import { Controller } from '@hubai/core';
import { LocalExtensionViewModel } from '../models/extension';

export interface IExtensionListController extends Partial<Controller> {
  onExtensionClick?: (item: LocalExtensionViewModel) => void;
  onSaveSettings?: (
    extension: LocalExtensionViewModel,
    extensionSettings: any
  ) => void;
}
