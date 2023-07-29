import { IUser } from './user';

export interface ICurrentUserService {
  get(): Promise<IUser>;
}
