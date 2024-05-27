import app from 'data/realm/app';
import { IAuthClient } from 'api-server/authentication/models/authClient';
import { IUser } from './models/user';
import { ICurrentUserService } from './models/currentUserService';

export class RealmCurrentUserService implements ICurrentUserService {
  constructor(private readonly authClient: IAuthClient) {}

  async get(): Promise<IUser> {
    if (!app.currentUser) {
      await this.authClient.attemptCachedLogin();
    }

    if (!app.currentUser) {
      throw new Error('User is not logged in');
    }

    return {
      id: app.currentUser.id,
      profile: {
        name: app.currentUser.profile?.name ?? 'You',
        email: app.currentUser.profile?.email,
      },
    };
  }
}
