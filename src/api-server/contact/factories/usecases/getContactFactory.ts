import LocalGetContact from 'api-server/contact/data/usecases/localGetContact';
import { GetContact } from 'api-server/contact/domain/usecases/getContact';
import { makeContactRepository } from 'data/contact/factory';

const makeGetContact = async (): Promise<GetContact> => {
  return new LocalGetContact(await makeContactRepository());
};

export default makeGetContact;
