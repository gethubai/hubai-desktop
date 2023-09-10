export interface ILocalBrainDto {
  id: string;
  name: string;
  displayName: string;
  version: string;
  disabled?: boolean;
  installationDateUtc?: Date;
  updatedDateUtc?: Date;
}

export interface ILocalBrainRepository {
  add: (brain: ILocalBrainDto) => Promise<ILocalBrainDto>;
  update: (brain: ILocalBrainDto) => Promise<ILocalBrainDto>;
  getBrains: () => Promise<ILocalBrainDto[]>;
  getBrain: (id: string) => Promise<ILocalBrainDto | undefined>;
  getBrainByName: (name: string) => Promise<ILocalBrainDto | undefined>;
  remove: (id: string) => Promise<void>;
}
