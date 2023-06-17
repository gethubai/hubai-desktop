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

export type ChatMessageModel = {
  id: string;
  sender: string;
  senderId: string;
  senderType: ChatMessageSenderType;
  to: string; // id of the brain that will receive the message
  sendDate: Date | string;
  text?: TextMessage;
  image?: ImageMessage;
  voice?: VoiceMessage;
  messageType: ChatMessageType;
  status: ChatMessageStatus;
  chat: string;
};

export class SendChatMessageModel {
  chatId: string;

  sender: string;

  senderId: string;

  senderType: ChatMessageSenderType;

  to: string;

  text?: TextMessage;

  image?: ImageMessage;

  voice?: VoiceMessage;

  messageType: ChatMessageType;

  status: ChatMessageStatus;

  constructor(
    chatId: string,
    sender: string,
    senderId: string,
    senderType: ChatMessageSenderType,
    to: string
  ) {
    this.chatId = chatId;
    this.sender = sender;
    this.senderId = senderId;
    this.senderType = senderType;
    this.to = to;
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
}
