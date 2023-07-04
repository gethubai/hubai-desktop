import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';

export interface ILocalBrainRepository {
  add: (brain: LocalBrainModel) => Promise<LocalBrainModel>;
  update: (brain: LocalBrainModel) => Promise<LocalBrainModel>;
  getBrains: () => Promise<LocalBrainModel[]>;
  getBrain: (id: string) => Promise<LocalBrainModel | undefined>;
  getBrainByName: (name: string) => Promise<LocalBrainModel | undefined>;
}
