import {
  ChatMessageModel,
  ChatMessageType,
  IChatUserSettings,
} from './chatMessage';

export enum ChatMemberType {
  user = 'user',
  brain = 'brain',
  assistant = 'assistant',
}

export enum ChatUserRole {
  admin = 'admin',
  member = 'member',
}

export type ChatMemberStatus = {
  isTyping?: boolean;
};

export type ChatUser = {
  id: string;
  memberType: ChatMemberType;
  settings?: IChatUserSettings;
  handleMessageTypes?: ChatMessageType[];
  role?: ChatUserRole; // TODO: Refactor this with a RBAC system
};

export enum ChatActivityKind {
  textMessage = 'textMessage',
  voiceMessage = 'voiceMessage',
  imageMessage = 'imageMessage',
  fileMessage = 'fileMessage',
}

export type ChatActivity = {
  /* The id of the user that performed the activity */
  executorId: string;
  value?: string;
  dateUtc: Date | string;
  kind: ChatActivityKind;
};

export type ChatModel = {
  id: string;
  name: string;
  initiator: string;
  createdDate: Date | string;
  messages?: ChatMessageModel[];
  members: ChatUser[];
  lastActivity?: ChatActivity;
  /* 1-1 chats only */
  isDirect?: boolean;
};
