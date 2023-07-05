import { Component } from '@hubai/core/esm/react';
import { container } from 'tsyringe';
import { ILocalUser, LocalUserModel } from '../models/user';

export interface ILocalUserService extends Component<ILocalUser> {
  getUser(): ILocalUser;
}

export class LocalUserService
  extends Component<ILocalUser>
  implements ILocalUserService
{
  protected state: ILocalUser;

  constructor() {
    super();
    this.state = container.resolve(LocalUserModel);
  }

  getUser(): ILocalUser {
    return this.state;
  }
}
