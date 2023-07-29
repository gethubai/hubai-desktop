import { Auth0Client } from '../auth0/client';
import { IAuthClient } from '../models/authClient';

const authClient = new Auth0Client();
const makeAuthClient = (): IAuthClient => {
  return authClient;
};

export default makeAuthClient;
