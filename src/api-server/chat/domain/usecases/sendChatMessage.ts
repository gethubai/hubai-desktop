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

export type SendChatMessageParams = {
  chatId: string;
  senderId: string;
  senderType?: ChatMessageSenderType;
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

export type SendChatMessageModel = ChatMessageModel;

export interface SendMessage {
  send: (params: SendChatMessageParams) => Promise<SendChatMessageModel>;
}
