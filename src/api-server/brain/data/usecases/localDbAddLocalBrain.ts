import {
  BrainCapability,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { AddLocalBrain } from 'api-server/brain/domain/usecases/addLocalBrain';
import { Database } from 'data/brain/db';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';

export default class LocalDbAddLocalBrain implements AddLocalBrain {
  constructor(private readonly database: Database) {}

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

    const brainWithName = await this.database.brains
      .findOne({
        selector: {
          name: {
            $eq: brain.name,
          },
        },
      })
      .exec();

    if (brainWithName) {
      // Update brain
      const result = await brainWithName.incrementalUpdate({
        $set: {
          title: brain.nameAlias ?? brain.name,
          description: brain.description,
          main: brain.main,
          version: brain.version,
          capabilities: brain.capabilities,
          settingsMap: brain.settingsMap,
        },
      });

      return result._data as LocalBrainModel;
    }

    const result = await this.database.brains.insert({
      ...brain,
      id: generateUniqueId(),
      createdDate: new Date().toISOString(),
      capabilities: brain.capabilities as BrainCapability[],
      title: brain.nameAlias ?? brain.name,
    });

    return result._data as LocalBrainModel;
  };
}
