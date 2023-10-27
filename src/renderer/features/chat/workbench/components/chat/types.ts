import {
  AttachmentType,
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

export type ChatMessageAttachment = {
  id: string;
  fileSrc: string;
  attachmentType: AttachmentType;
  mimeType: string;
  size: string;
  name: string;
};

export type ChatMessageViewModel = {
  id: string;
  textContent?: string;
  voiceContent?: ChatVoiceMessageContent;
  attachments?: ChatMessageAttachment[];
  messageContentType: ChatMessageType;
  sentAt: Date;
  senderDisplayName: string;
  messageType: ChatMessageSendType;
  status: ChatMessageStatus;
  avatarSrc?: string;
  avatarIcon?: string;
};
