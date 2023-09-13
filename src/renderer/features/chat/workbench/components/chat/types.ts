import {
  ChatMessageStatus,
  ChatMessageType,
} from 'api-server/chat/domain/models/chatMessage';

export enum ChatAction {
  sendMessage = 'chat.send',
}

export type ChatMessageSendType = 'request' | 'response';

export type ChatVoiceMessageContent = {
  audioSrc: string;
  duration?: number;
  mimeType?: string;
};

export type ChatMessageViewModel = {
  id: string;
  textContent?: string;
  voiceContent?: ChatVoiceMessageContent;
  messageContentType: ChatMessageType;
  sentAt: Date;
  senderDisplayName: string;
  messageType: ChatMessageSendType;
  status: ChatMessageStatus;
  avatarSrc?: string;
  avatarIcon?: string;
};
