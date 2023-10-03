import { ChatModel } from 'api-server/chat/domain/models/chat';

export type ChatListFilters = {
  /* Chat that contains this userId as a member */
  userId?: string | string[];
  isDirect?: boolean;
};

export interface IChatRepository {
  add: (model: ChatModel) => Promise<ChatModel>;
  update: (model: ChatModel) => Promise<ChatModel>;
  list: (filters?: ChatListFilters) => Promise<ChatModel[]>;
  get: (id: string) => Promise<ChatModel | undefined>;
}
