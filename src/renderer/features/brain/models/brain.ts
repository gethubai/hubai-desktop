import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { IActionBarItemProps } from 'mo/components';

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
