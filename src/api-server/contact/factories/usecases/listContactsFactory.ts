import LocalListContacts from 'api-server/contact/data/usecases/localListContacts';
import { ListContacts } from 'api-server/contact/domain/usecases/listContacts';
import { makeContactRepository } from 'data/contact/factory';

const makeListContacts = async (): Promise<ListContacts> => {
  return new LocalListContacts(await makeContactRepository());
};

export default makeListContacts;
