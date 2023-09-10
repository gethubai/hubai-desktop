import { IActionBarItemProps } from '@hubai/core/esm/components';
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';

export enum BrainEvent {
  onBrainSettingsUpdated = 'brain.onSettingsUpdated',
  onBrainUninstalled = 'brain.onUninstalled',
}

export type LocalBrainViewModel = LocalBrainModel & {};

export interface IBrainState {
  brains: LocalBrainViewModel[];
  headerToolBar?: IActionBarItemProps[];
}

export class BrainStateModel implements IBrainState {
  brains: LocalBrainViewModel[];

  headerToolBar?: IActionBarItemProps[];

  constructor(
    brains: LocalBrainViewModel[] = [],
    headerToolBar: IActionBarItemProps<any>[] = []
  ) {
    this.brains = brains;
    this.headerToolBar = headerToolBar;
  }
}
