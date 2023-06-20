import { ChatBrain, ChatModel } from '../models/chat';

export interface UpdateChatBrains {
  update: (params: UpdateChatBrains.Params) => Promise<UpdateChatBrains.Model>;
}

export namespace UpdateChatBrains {
  // Id of the message
  export type Params = {
    chatId: string;
    brains: ChatBrain[];
  };

  export type Model = ChatModel;
}
