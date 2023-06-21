/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/destructuring-assignment */
import { Component } from 'mo/react';
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { container, singleton } from 'tsyringe';
import { BrainStateModel, IBrainState } from '../models/brain';

export interface IBrainManagementService extends Component<IBrainState> {
  getBrains(): LocalBrainModel[];
}

@singleton()
export class BrainManagementService
  extends Component<IBrainState>
  implements IBrainManagementService
{
  protected state: IBrainState;

  constructor() {
    super();
    this.state = container.resolve(BrainStateModel);
  }

  getBrains(): LocalBrainModel[] {
    return this.state.brains;
  }
}
