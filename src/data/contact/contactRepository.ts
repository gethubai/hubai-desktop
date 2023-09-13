export interface IContactDto {
  id: string;
  name: string;
  originalName: string;
  avatar?: string;
  updatedDateUtc?: Date;
  createdDateUtc?: Date;
}

export interface IContactRepository {
  add: (dto: IContactDto) => Promise<IContactDto>;
  update: (dto: IContactDto) => Promise<IContactDto>;
  list: () => Promise<IContactDto[]>;
  get: (id: string) => Promise<IContactDto | undefined>;
  remove: (id: string) => Promise<void>;
}
