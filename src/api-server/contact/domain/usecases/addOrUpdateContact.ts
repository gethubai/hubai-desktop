import { Contact } from '../models/contact';

export type AddOrUpdateContactParams = Contact;
export type AddOrUpdateContactModel = Contact;

export interface AddOrUpdateContact {
  execute: (
    params: AddOrUpdateContactParams
  ) => Promise<AddOrUpdateContactModel>;
}
