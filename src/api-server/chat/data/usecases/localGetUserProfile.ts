import { GetUserProfile } from 'api-server/chat/domain/usecases/getUserProfile';
import { GetContact } from 'api-server/contact/domain/usecases/getContact';
import { ICurrentUserService } from 'api-server/user/models/currentUserService';

export default class LocalGetUserProfile implements GetUserProfile {
  constructor(
    private readonly currentUserService: ICurrentUserService,
    private readonly getContact: GetContact
  ) {}

  profile = async (
    params: GetUserProfile.Params
  ): Promise<GetUserProfile.Model> => {
    if (!params.userId) throw new Error('User id is required');

    const currentUser = await this.currentUserService.get();

    if (currentUser.id === params.userId) {
      return currentUser.profile;
    }

    const contact = await this.getContact.execute({ id: params.userId });

    return {
      name: contact?.name || 'Unknown',
      avatar: contact?.avatar,
    };
  };
}
