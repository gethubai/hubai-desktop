import app from 'data/realm/app';
import { auth0Login } from 'electron-auth0-login';
import { SafeKeyStore } from 'utils/keyStore';
import Realm from 'realm';
import { IAuthClient, IAuthResult } from '../models/authClient';

const tokenStorage = new SafeKeyStore(
  'refreshToken',
  'auth',
  'pls-dont-hack-me' // This is just to obfuscate the key in the file system, it's not intended to be secure
);

const { auth0: auth0Settings } = require('../../../../env-variables.json');

const auth0 = auth0Login({
  // Get these values from your Auth0 application console
  auth0: {
    ...(auth0Settings ?? {}),
    scopes: 'openid profile offline_access email',
  },
  refreshTokens: {
    store: {
      get: async () => tokenStorage.get(),
      set: async (token) => tokenStorage.set(token),
      delete: async () => tokenStorage.delete(),
    },
  },
});

export class Auth0Client implements IAuthClient {
  public async isLoggedIn(): Promise<boolean> {
    // This returns false if we didn't call the getToken method yet, so we can't trust it
    if (await auth0.isLoggedIn()) {
      return true;
    }
    return tokenStorage.isSet();
  }

  public async attemptCachedLogin(): Promise<void> {
    // check if we are already logged in
    if (!app.currentUser) {
      let credentials: Realm.Credentials;
      const jwtToken = await this.getAccessToken();

      if (jwtToken) {
        credentials = Realm.Credentials.jwt(jwtToken);
      } else {
        credentials = Realm.Credentials.anonymous();
      }
      await app.logIn(credentials);
    }
  }

  public async anonymousLogin(): Promise<void> {
    await app.logIn(Realm.Credentials.anonymous());
  }

  public async login(): Promise<IAuthResult> {
    const currentAccessToken = await this.getAccessToken();

    if (currentAccessToken) {
      return { accessToken: currentAccessToken };
    }

    const token = await auth0.login();
    if (token) {
      if (app.currentUser) {
        try {
          // Try to link the current user with the new credentials (this only works if user does not have an account)
          await app.currentUser.linkCredentials(Realm.Credentials.jwt(token));
        } catch (e) {
          // If linking fails, log out the current user and log in again with the new credentials
          await app.currentUser.logOut();
          await app.logIn(Realm.Credentials.jwt(token));
        }
      } else {
        await app.logIn(Realm.Credentials.jwt(token));
      }
    }

    return { accessToken: token };
  }

  public async getAccessToken(): Promise<string | undefined> {
    const isAuthenticated = await this.isLoggedIn();
    if (!isAuthenticated) return undefined;
    return auth0.getToken();
  }

  public async logout(): Promise<void> {
    if (app.currentUser) await app.currentUser.logOut();

    await auth0.logout();
  }
}
