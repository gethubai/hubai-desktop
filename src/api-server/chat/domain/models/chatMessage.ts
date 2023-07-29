/* eslint-disable max-classes-per-file */
export type ChatMessageSenderType = 'user' | 'brain';
export type ChatMessageType = 'text' | 'image' | 'voice';

export enum ChatMessageStatus {
  WAITING = 'waiting',
  SENT = 'sent',
  DELIVERED = 'delivered',
  SEEN = 'seen',
}

export enum ChatMessageEvent {
  SENT = 'chatMessage.sent',
  DELIVERED = 'chatMessage.delivered',
  SEEN = 'chatMessage.seen',
}

export type TextMessage = {
  body: string;
};
export type ImageMessage = {
  file: string;
  mimeType?: string;
  caption?: string;
};

export type VoiceMessage = {
  file: string;
  mimeType?: string;
};

export type RawVoiceMessage = {
  data: Blob | Buffer;
  mimeType?: string;
};

export type ChatMessageRecipient = {
  id: string;
  status: ChatMessageStatus;
  receivedDate?: Date;
  seenDate?: Date;
};

export type ChatMessageModel = {
  id: string;
  senderId: string;
  recipients: ChatMessageRecipient[];
  sendDate: Date | string;
  text?: TextMessage;
  image?: ImageMessage;
  voice?: VoiceMessage;
  messageType: ChatMessageType;
  status: ChatMessageStatus;
  // Message won't show up in the chat window if this is true
  hidden?: boolean;
  chat: string;
};

export interface IRecipientSettings {
  [settingId: string]: any;
}

export class SendChatMessageModel {
  chatId: string;

  senderId: string;

  text?: TextMessage;

  image?: ImageMessage;

  voice?: VoiceMessage;

  messageType: ChatMessageType;

  status: ChatMessageStatus;

  recipientSettings?: IRecipientSettings;

  constructor(chatId: string, senderId: string) {
    this.chatId = chatId;
    this.senderId = senderId;
    this.status = ChatMessageStatus.WAITING;
    this.messageType = 'text'; // default is text
  }

  setText(text: TextMessage) {
    this.text = text;
    this.messageType = 'text';
  }

  setImage(image: ImageMessage) {
    this.image = image;
    this.messageType = 'image';
  }

  setVoice(voice: VoiceMessage) {
    this.voice = voice;
    this.messageType = 'voice';
  }

  setRecipientSettings(settings: IRecipientSettings) {
    this.recipientSettings = settings;
  }
}
