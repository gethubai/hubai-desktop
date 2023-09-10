import { Controller } from '@hubai/core';
import { IMenuItemProps } from '@hubai/core/esm/components';
import { LocalBrainViewModel } from '../models/brain';

export interface IBrainController extends Partial<Controller> {
  onBrainClick?: (item: LocalBrainViewModel) => void;
  onSaveSettings?: (brain: LocalBrainViewModel, brainSettings: any) => void;
  onContextMenuClick?: (
    menu: IMenuItemProps,
    item: LocalBrainViewModel
  ) => void;
}
