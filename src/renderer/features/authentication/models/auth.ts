export interface IAuthState {
  isLoggedIn: boolean;
}

export class AuthStateModel implements IAuthState {
  isLoggedIn: boolean;

  constructor(isLoggedIn: boolean = false) {
    this.isLoggedIn = isLoggedIn;
  }
}
