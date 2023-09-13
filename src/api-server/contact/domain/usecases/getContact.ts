import { Contact } from '../models/contact';

export interface GetContact {
  execute: (params: GetContact.Params) => Promise<GetContact.Model>;
}

export namespace GetContact {
  export type Params = { id: string };

  export type Model = Contact | undefined;
}
