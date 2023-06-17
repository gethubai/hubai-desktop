import { ChatModel } from '../models/chat';

export interface LoadChatList {
  loadChats: () => Promise<LoadChatList.Model[]>;
}

export namespace LoadChatList {
  export type Model = ChatModel;
}
