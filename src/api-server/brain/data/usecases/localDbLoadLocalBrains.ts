/* eslint-disable no-underscore-dangle */
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { LoadLocalBrains } from 'api-server/brain/domain/usecases/loadLocalBrains';
import { Database } from 'data/brain/db';

export default class LocalDbLoadLocalBrains implements LoadLocalBrains {
  constructor(private readonly database: Database) {}

  getBrains = async (): Promise<LocalBrainModel[]> => {
    const brains = await this.database.brains.find().exec();

    return brains.map((b) => b._data as LocalBrainModel);
  };
}
