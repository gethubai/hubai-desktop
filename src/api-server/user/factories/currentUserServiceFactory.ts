import makeAuthClient from 'api-server/authentication/factories/authClientFactory';
import { RealmCurrentUserService } from '../realmCurrentUserService';
import { ICurrentUserService } from '../models/currentUserService';

const userService = new RealmCurrentUserService(makeAuthClient());
const makeCurrentUserService = (): ICurrentUserService => {
  return userService;
};

export default makeCurrentUserService;
