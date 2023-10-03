import { ChatModel } from '../models/chat';

export interface LoadChatList {
  loadChats: (params: LoadChatList.Params) => Promise<LoadChatList.Model[]>;
}

export namespace LoadChatList {
  export type Params = {
    userId?: string | string[];
    isDirect?: boolean;
  };

  export type Model = ChatModel;
}
