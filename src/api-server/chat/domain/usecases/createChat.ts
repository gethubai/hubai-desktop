import { ChatUser, ChatModel } from '../models/chat';

export type CreateChatParams = {
  name: string;
  members: ChatUser[];
  initiator: string;
  isDirect?: boolean;
};

export type CreateChatModel = ChatModel;

export interface CreateChat {
  create: (params: CreateChatParams) => Promise<CreateChatModel>;
}
