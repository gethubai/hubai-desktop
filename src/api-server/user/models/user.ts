export interface IUserProfile {
  name: string;
  email?: string;
  avatar?: string;
}

export interface IUser {
  id: string;
  profile: IUserProfile;
}
