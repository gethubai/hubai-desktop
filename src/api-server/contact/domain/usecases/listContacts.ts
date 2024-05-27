import { Contact } from '../models/contact';

export type ListContactsParams = object;
export type ListContactsModel = Contact[];

export interface ListContacts {
  execute: (params?: ListContactsParams) => Promise<ListContactsModel>;
}
