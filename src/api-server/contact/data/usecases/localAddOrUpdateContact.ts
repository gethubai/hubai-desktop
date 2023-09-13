import { AddOrUpdateContact } from 'api-server/contact/domain/usecases/addOrUpdateContact';
import { IContactRepository } from 'data/contact/contactRepository';
import { getCurrentUtcDate } from 'utils/dateUtils';

export default class LocalAddOrUpdateContact implements AddOrUpdateContact {
  constructor(private readonly repository: IContactRepository) {}

  async execute(
    params: AddOrUpdateContact.Params
  ): Promise<AddOrUpdateContact.Model> {
    const { id, name, avatar } = params;

    if (!name) throw new Error('Contact name is required');

    if (!id) throw new Error('Id is required');

    const contact = await this.repository.get(id);

    if (contact) {
      const updatedContact = await this.repository.update({
        ...contact,
        name,
        avatar,
        updatedDateUtc: getCurrentUtcDate(),
      });
      return updatedContact;
    }

    const newContact = await this.repository.add({
      id,
      name,
      originalName: name,
      avatar,
      createdDateUtc: getCurrentUtcDate(),
    });

    return newContact;
  }
}
