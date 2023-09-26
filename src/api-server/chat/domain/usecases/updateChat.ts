import { ChatUser, ChatModel, ChatActivity } from '../models/chat';

export interface UpdateChat {
  execute: (params: UpdateChat.Params) => Promise<UpdateChat.Model>;
}

export namespace UpdateChat {
  export type Params = {
    id: string;
    name?: string;
    members?: ChatUser[];
    lastActivity: ChatActivity;
  };

  export type Model = ChatModel;
}
