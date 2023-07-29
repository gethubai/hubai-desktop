import { Component } from '@hubai/core/esm/react';
import { container, injectable } from 'tsyringe';
import { IAuthState } from '../models/auth';

export interface IAuthService extends Component<IAuthState> {
  isLoggedIn(): boolean;
}

@injectable()
export class AuthenticationService
  extends Component<IAuthState>
  implements IAuthService
{
  protected state: IAuthState;

  constructor() {
    super();
    this.state = container.resolve('IAuthState');
  }

  isLoggedIn(): boolean {
    return window.electron.auth.isLoggedIn();
  }
}
