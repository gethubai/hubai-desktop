import Realm from 'realm';
import { ILocalBrainDto, ILocalBrainRepository } from '../localBrainRepository';
import { LocalBrainDto } from './db';

export class RealmLocalBrainRepository implements ILocalBrainRepository {
  constructor(private readonly database: Realm) {}

  update = (brain: ILocalBrainDto): Promise<ILocalBrainDto> => {
    return new Promise<ILocalBrainDto>((resolve, reject) => {
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
        dto.displayName = brain.displayName;
        dto.version = brain.version;
        dto.disabled = brain.disabled;
        dto.updatedDateUtc = brain.updatedDateUtc;
        resolve(dto.values);
        return dto;
      });
    });
  };

  add = async (brain: ILocalBrainDto): Promise<ILocalBrainDto> => {
    let createdBrain: ILocalBrainDto | undefined;
    this.database.write(() => {
      createdBrain = this.database.create(LocalBrainDto, brain).values;
    });

    if (!createdBrain)
      throw new Error('Failed to create brain in local database');
    return createdBrain;
  };

  remove = async (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      let dto = this.database.objectForPrimaryKey(LocalBrainDto, id);

      if (!dto)
        reject(
          new Error(
            `Cannot remove brain with id ${id} because it does not exist`
          )
        );

      this.database.write(() => {
        this.database.delete(dto);
        dto = undefined;

        resolve();
      });
    });
  };

  getBrains = async (): Promise<ILocalBrainDto[]> => {
    const brains = this.database.objects(LocalBrainDto);
    return brains.map((item) => item.values);
  };

  getBrain = async (id: string): Promise<ILocalBrainDto | undefined> => {
    const brain = this.database.objectForPrimaryKey(LocalBrainDto, id);

    return brain?.values;
  };

  getBrainByName = async (
    name: string
  ): Promise<ILocalBrainDto | undefined> => {
    const brain = this.database
      .objects(LocalBrainDto)
      .filtered(`name == $0`, name);

    if (brain.length > 0) return brain[0].values;

    return undefined;
  };
}
