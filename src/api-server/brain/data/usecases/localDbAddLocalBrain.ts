import {
  BrainCapability,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { AddLocalBrain } from 'api-server/brain/domain/usecases/addLocalBrain';
import { ILocalBrainRepository } from 'data/brain/localBrainRepository';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { getCurrentUtcDate } from 'utils/dateUtils';

export default class LocalDbAddLocalBrain implements AddLocalBrain {
  constructor(private readonly repository: ILocalBrainRepository) {}

  add = async (brain: AddLocalBrain.Params): Promise<LocalBrainModel> => {
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
      // Update brain
      const result = await this.repository.update({
        ...brainWithName,
        displayName,
        description: brain.description,
        main: brain.main,
        version: brain.version,
        capabilities: brain.capabilities as BrainCapability[],
        settingsMap: brain.settingsMap,
        icon: brain.icon,
        iconUrl: brain.iconUrl,
        updatedDateUtc: getCurrentUtcDate(),
      });
      return result;
    }

    const result = await this.repository.add({
      ...brain,
      id: generateUniqueId(),
      displayName,
      capabilities: brain.capabilities as BrainCapability[],
      installationDateUtc: getCurrentUtcDate(),
      publisher: brain.publisher,
    });
    return result;
  };
}
