import {
  Controller,
  type IActivityBarService,
  localize,
  IActivityMenuItemProps,
} from '@hubai/core';
import { inject, injectable } from 'tsyringe';
import { constants } from 'mo/services/builtinService/const';
import {
  type ITelemetryService,
  TelemetryEvents,
} from 'renderer/common/telemetry';
import { type IAuthService } from '../services/authService';

export type IAuthController = Partial<Controller>;

const contextMenuActions = {
  ACTION_SIGN_IN: 'auth.action.login',
  ACTION_LOGOUT: 'auth.action.logout',
};

@injectable()
export default class AuthController
  extends Controller
  implements IAuthController
{
  constructor(
    @inject('IAuthService')
    private readonly authService: IAuthService,
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('ITelemetryService')
    private readonly telemetryService: ITelemetryService
  ) {
    super();
  }

  public initView(): void {
    this.activityBarService.add({
      id: constants.ACTIVITY_BAR_GLOBAL_ACCOUNT,
      name: localize('menu.account', 'Account'),
      title: localize('menu.account', 'Account'),
      icon: 'account',
      type: 'global',
      contextMenu: this.authService.isLoggedIn()
        ? this.getAuthenticatedActions()
        : this.getUnauthenticatedActions(),
      sortIndex: -1,
    });

    window.electron.ipcRenderer.on('logged-out', () => {
      this.telemetryService.log(TelemetryEvents.AUTH_SIGN_OUT);
      window.electron.restart();
    });

    window.electron.ipcRenderer.on('logged-in', () => {
      this.telemetryService.log(TelemetryEvents.AUTH_SIGN_IN);
      window.electron.restart();
    });
  }

  public getUnauthenticatedActions = (): IActivityMenuItemProps[] => {
    return [
      {
        id: contextMenuActions.ACTION_SIGN_IN,
        name: 'Sign In',
        onClick: this.signIn.bind(this),
      },
    ];
  };

  public getAuthenticatedActions = (): IActivityMenuItemProps[] => {
    return [
      {
        id: contextMenuActions.ACTION_LOGOUT,
        name: 'Logout',
        onClick: this.logout.bind(this),
      },
    ];
  };

  private signIn = () => {
    window.electron.auth.showAuthWindow();
  };

  private logout = async () => {
    await window.electron.auth.logout();
  };
}
