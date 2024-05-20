import { getBrainAvatarUrl } from 'api-server/brain/const';
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import {
  AddLocalBrain,
  AddLocalBrainParams,
} from 'api-server/brain/domain/usecases/addLocalBrain';
import { AddOrUpdateContact } from 'api-server/contact/domain/usecases/addOrUpdateContact';
import {
  ILocalBrainDto,
  ILocalBrainRepository,
} from 'data/brain/localBrainRepository';
import { getCurrentUtcDate } from 'utils/dateUtils';

export default class LocalDbAddLocalBrain implements AddLocalBrain {
  constructor(
    private readonly repository: ILocalBrainRepository,
    private readonly addOrUpdateContact: AddOrUpdateContact
  ) {}

  add = async (brain: AddLocalBrainParams): Promise<LocalBrainModel> => {
    // throw error if brain name contains any character other than letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(brain.name)) {
      throw new Error(
        'Brain name can only contain letters, numbers, and underscores'
      );
    }

    // throw error if brain name is empty
    if (brain.name.length === 0) {
      throw new Error('Brain name cannot be empty');
    }

    // throw error if brain name is too long
    if (brain.name.length > 50) {
      throw new Error('Brain name cannot be longer than 50 characters');
    }

    if (!brain.capabilities || brain.capabilities.length === 0) {
      throw new Error('Brain must have at least one capability');
    }

    const brainWithName = await this.repository.getBrainByName(brain.name);
    const displayName = brain.displayName ?? brain.name;

    if (brainWithName) {
      const brainModel = {
        ...brainWithName,
        displayName,
        main: brain.main,
        version: brain.version,
        disabled: brain.disabled,
        updatedDateUtc: getCurrentUtcDate(),
      } as ILocalBrainDto;

      // Update brain
      const result = await this.repository.update(brainModel);

      await this.addOrUpdateContact.execute({
        id: result.id,
        name: result.displayName,
        avatar: getBrainAvatarUrl(result as any),
      });

      return { ...brain, ...result } as LocalBrainModel;
    }

    const result = await this.repository.add({
      ...brain,
      id: `${brain.publisher}.${brain.name}`,
      displayName,
      installationDateUtc: getCurrentUtcDate(),
    });

    await this.addOrUpdateContact.execute({
      id: result.id,
      name: result.displayName,
      avatar: getBrainAvatarUrl(result as any),
    });

    return { ...brain, ...result } as LocalBrainModel;
  };
}
