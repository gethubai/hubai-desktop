import { ChatUser, ChatModel, ChatActivity } from '../models/chat';

export type UpdateChatParams = {
  id: string;
  name?: string;
  members?: ChatUser[];
  lastActivity?: ChatActivity;
};

export type UpdateChatModel = ChatModel;

export interface UpdateChat {
  execute: (params: UpdateChatParams) => Promise<UpdateChatModel>;
}
