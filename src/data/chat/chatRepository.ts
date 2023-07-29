import { ChatModel } from 'api-server/chat/domain/models/chat';

export interface IChatRepository {
  add: (model: ChatModel) => Promise<ChatModel>;
  update: (model: ChatModel) => Promise<ChatModel>;
  list: (userId?: string) => Promise<ChatModel[]>;
  get: (id: string) => Promise<ChatModel | undefined>;
}
