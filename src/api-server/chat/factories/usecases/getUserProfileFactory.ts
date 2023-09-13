import LocalGetUserProfile from 'api-server/chat/data/usecases/localGetUserProfile';
import { GetUserProfile } from 'api-server/chat/domain/usecases/getUserProfile';
import makeGetContact from 'api-server/contact/factories/usecases/getContactFactory';
import makeCurrentUserService from 'api-server/user/factories/currentUserServiceFactory';

const makeGetUserProfile = async (): Promise<GetUserProfile> => {
  return new LocalGetUserProfile(
    makeCurrentUserService(),
    await makeGetContact()
  );
};

export default makeGetUserProfile;
