import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { LoadLocalBrains } from 'api-server/brain/domain/usecases/loadLocalBrains';
import { ILocalBrainRepository } from 'data/brain/localBrainRepository';

export default class LocalDbLoadLocalBrains implements LoadLocalBrains {
  constructor(private readonly repository: ILocalBrainRepository) {}

  getBrains = async (): Promise<LocalBrainModel[]> => {
    const brains = await this.repository.getBrains();
    return brains;
  };
}
