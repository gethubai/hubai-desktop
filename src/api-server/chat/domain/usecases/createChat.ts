import { ChatBrain, ChatModel } from '../models/chat';

export interface CreateChat {
  create: (params: CreateChat.Params) => Promise<CreateChat.Model>;
}

export namespace CreateChat {
  export type Params = {
    name: string;
    initiator: string;
    brains: ChatBrain[];
  };

  export type Model = ChatModel;
}
