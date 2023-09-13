import { GetContact } from 'api-server/contact/domain/usecases/getContact';
import { IContactRepository } from 'data/contact/contactRepository';

export default class LocalGetContact implements GetContact {
  constructor(private readonly repository: IContactRepository) {}

  async execute(params: GetContact.Params): Promise<GetContact.Model> {
    const { id } = params;

    const contact = await this.repository.get(id);

    return contact;
  }
}
