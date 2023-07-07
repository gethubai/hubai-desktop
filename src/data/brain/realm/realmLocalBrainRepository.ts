import Realm from 'realm';
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { ILocalBrainRepository } from '../localBrainRepository';
import { LocalBrainDto } from './db';

export class RealmLocalBrainRepository implements ILocalBrainRepository {
  constructor(private readonly database: Realm) {}

  update = (brain: LocalBrainModel): Promise<LocalBrainModel> => {
    return new Promise<LocalBrainModel>((resolve, reject) => {
      this.database.write(() => {
        const dto = this.database.objectForPrimaryKey(LocalBrainDto, brain.id);

        if (!dto) {
          return reject(
            new Error(
              `Cannot update brain with id ${brain.id} because it does not exist`
            )
          );
        }

        dto.name = brain.name;
        dto.description = brain.description;
        dto.displayName = brain.displayName;
        dto.version = brain.version;
        dto.main = brain.main;
        dto.capabilities = brain.capabilities;
        dto.settingsMap = brain.settingsMap;
        dto.updatedDate = brain.updatedDate;
        resolve(dto.values);
        return dto;
      });
    });
  };

  add = async (brain: LocalBrainModel): Promise<LocalBrainModel> => {
    let createdBrain: LocalBrainModel | undefined;
    this.database.write(() => {
      createdBrain = this.database.create(LocalBrainDto, brain).values;
    });

    if (!createdBrain)
      throw new Error('Failed to create brain in local database');
    return createdBrain;
  };

  getBrains = async (): Promise<LocalBrainModel[]> => {
    const brains = this.database.objects(LocalBrainDto);
    return brains.map((item) => item.values);
  };

  getBrain = async (id: string): Promise<LocalBrainModel | undefined> => {
    const brain = this.database.objectForPrimaryKey(LocalBrainDto, id);

    return brain?.values;
  };

  getBrainByName = async (
    name: string
  ): Promise<LocalBrainModel | undefined> => {
    const brain = this.database
      .objects(LocalBrainDto)
      .filtered(`name == $0`, name);

    if (brain.length > 0) return brain[0] as LocalBrainModel;

    return undefined;
  };
}
