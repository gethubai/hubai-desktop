import { BrainModel } from 'api-server/brain/domain/models/brain';
import { IActionBarItemProps } from 'mo/components';

export type BrainViewModel = BrainModel & {};

export interface IBrainState {
  brains: BrainViewModel[];
  headerToolBar?: IActionBarItemProps[];
}

export class BrainStateModel implements IBrainState {
  brains: BrainViewModel[];

  headerToolBar?: IActionBarItemProps[];

  constructor(
    brains: BrainViewModel[] = [],
    headerToolBar: IActionBarItemProps<any>[] = []
  ) {
    this.brains = brains;
    this.headerToolBar = headerToolBar;
  }
}
