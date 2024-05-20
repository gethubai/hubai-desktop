import { ChatModel } from '../models/chat';

export type LoadChatListParams = {
  userId?: string | string[];
  isDirect?: boolean;
};

export type LoadChatListModel = ChatModel;

export interface LoadChatList {
  loadChats: (params: LoadChatListParams) => Promise<LoadChatListModel[]>;
}
