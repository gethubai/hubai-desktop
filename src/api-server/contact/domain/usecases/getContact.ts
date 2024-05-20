import { Contact } from '../models/contact';

export type GetContactParams = { id: string };
export type GetContactModel = Contact | undefined;

export interface GetContact {
  execute: (params: GetContactParams) => Promise<GetContactModel>;
}
