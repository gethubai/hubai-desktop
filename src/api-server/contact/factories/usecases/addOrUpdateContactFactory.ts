import LocalAddOrUpdateContact from 'api-server/contact/data/usecases/localAddOrUpdateContact';
import { AddOrUpdateContact } from 'api-server/contact/domain/usecases/addOrUpdateContact';
import { makeContactRepository } from 'data/contact/factory';

const makeAddOrUpdateContact = async (): Promise<AddOrUpdateContact> => {
  return new LocalAddOrUpdateContact(await makeContactRepository());
};

export default makeAddOrUpdateContact;
