import { Component } from '@hubai/core/esm/react';
import { container } from 'tsyringe';
import { IUser } from 'api-server/user/models/user';
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

    window.electron.ipcRenderer.on('set-current-user', (user: IUser) => {
      this.setState({ id: user.id, name: user.profile.name });
    });
  }

  getUser(): ILocalUser {
    return this.state;
  }
}
