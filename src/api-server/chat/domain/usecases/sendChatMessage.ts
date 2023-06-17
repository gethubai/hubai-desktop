import { ChatMessageModel, SendChatMessageModel } from '../models/chatMessage';

export namespace SendChatMessage {
  export type Params = SendChatMessageModel;

  export type Model = ChatMessageModel;
}

export interface SendMessage {
  send: (params: SendChatMessage.Params) => Promise<SendChatMessage.Model>;
}
