import { IUserProfile } from 'api-server/user/models/user';

export type GetUserProfileParams = {
  userId: string;
};

export type GetUserProfileModel = IUserProfile;

export interface GetUserProfile {
  profile: (params: GetUserProfileParams) => Promise<GetUserProfileModel>;
}
