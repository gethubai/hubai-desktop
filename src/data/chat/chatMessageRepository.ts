import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';

export type ChatMessageFilter = {
  ids?: string[];
  to?: string;
  status?: string;
  chatId?: string;
};

export interface IChatMessageRepository {
  add: (model: ChatMessageModel) => Promise<ChatMessageModel>;
  update: (model: ChatMessageModel) => Promise<ChatMessageModel>;
  get: (id: string) => Promise<ChatMessageModel | undefined>;
  getAll: (filter?: ChatMessageFilter) => Promise<ChatMessageModel[]>;
}
