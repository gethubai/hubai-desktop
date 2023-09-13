import { IUserProfile } from 'api-server/user/models/user';

export interface GetUserProfile {
  profile: (params: GetUserProfile.Params) => Promise<GetUserProfile.Model>;
}

export namespace GetUserProfile {
  export type Params = {
    userId: string;
  };

  export type Model = IUserProfile;
}
