import {
  ChatMessageModel,
  ChatMessageStatus,
  ChatMessageType,
  IRecipientSettings,
  ImageMessage,
  TextMessage,
  VoiceMessage,
} from '../models/chatMessage';

export namespace SendChatMessage {
  export type Params = {
    chatId: string;
    senderId: string;
    text?: TextMessage;
    image?: ImageMessage;
    voice?: VoiceMessage;
    messageType: ChatMessageType;
    status: ChatMessageStatus;
    recipientSettings?: IRecipientSettings;
    recipients: string[];
    hidden?: boolean;
  };

  export type Model = ChatMessageModel;
}

export interface SendMessage {
  send: (params: SendChatMessage.Params) => Promise<SendChatMessage.Model>;
}
