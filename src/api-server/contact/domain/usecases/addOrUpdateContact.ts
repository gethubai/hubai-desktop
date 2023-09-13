import { Contact } from '../models/contact';

export interface AddOrUpdateContact {
  execute: (
    params: AddOrUpdateContact.Params
  ) => Promise<AddOrUpdateContact.Model>;
}

export namespace AddOrUpdateContact {
  export type Params = Contact;

  export type Model = Contact;
}
