import {
  ChatMessageModel,
  ChatMessageSenderType,
  ChatMessageStatus,
  ChatMessageType,
  IRecipientSettings,
  ImageMessage,
  RawMessageAttachment,
  TextMessage,
  VoiceMessage,
} from '../models/chatMessage';

export namespace SendChatMessage {
  export type Params = {
    chatId: string;
    senderId: string;
    senderType: ChatMessageSenderType;
    text?: TextMessage;
    image?: ImageMessage;
    voice?: VoiceMessage;
    attachments?: RawMessageAttachment[];
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
