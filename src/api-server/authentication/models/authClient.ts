export interface IAuthResult {
  accessToken: string;
}

export interface IAuthClient {
  isLoggedIn(): Promise<boolean>;
  login(params?: any): Promise<IAuthResult>;
  attemptCachedLogin(): Promise<void>;
  getAccessToken(): Promise<string | undefined>;
  logout(): Promise<void>;
}
