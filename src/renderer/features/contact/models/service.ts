import { Contact } from 'api-server/contact/domain/models/contact';

export interface IContactService {
  list(): Contact[];
  get(id: string): Contact | undefined;
}
