import { ListContacts } from 'api-server/contact/domain/usecases/listContacts';
import { IContactRepository } from 'data/contact/contactRepository';

export default class LocalListContacts implements ListContacts {
  constructor(private readonly repository: IContactRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(params?: ListContacts.Params): Promise<ListContacts.Model> {
    return (await this.repository.list()) ?? [];
  }
}
