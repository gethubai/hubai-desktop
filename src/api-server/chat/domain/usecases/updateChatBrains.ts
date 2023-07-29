import { ChatModel, ChatUser } from '../models/chat';

export interface UpdateChatMembers {
  update: (
    params: UpdateChatMembers.Params
  ) => Promise<UpdateChatMembers.Model>;
}

export namespace UpdateChatMembers {
  // Id of the message
  export type Params = {
    chatId: string;
    members: ChatUser[];
  };

  export type Model = ChatModel;
}
