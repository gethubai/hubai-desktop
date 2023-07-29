import { ChatUser, ChatModel } from '../models/chat';

export interface CreateChat {
  create: (params: CreateChat.Params) => Promise<CreateChat.Model>;
}

export namespace CreateChat {
  export type Params = {
    name: string;
    members: ChatUser[];
    initiator: string;
  };

  export type Model = ChatModel;
}
