import { Contact } from '../models/contact';

export interface ListContacts {
  execute: (params?: ListContacts.Params) => Promise<ListContacts.Model>;
}

export namespace ListContacts {
  export type Params = {};

  export type Model = Contact[];
}
