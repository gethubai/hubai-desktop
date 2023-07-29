import { ChatMessageModel, ChatMessageType } from './chatMessage';

export interface IChatUserSettings {
  [settingId: string]: any;
}

export enum ChatMemberType {
  user = 'user',
  brain = 'brain',
}

export enum ChatUserRole {
  admin = 'admin',
  member = 'member',
}

export type ChatUser = {
  id: string;
  memberType: ChatMemberType;
  settings?: IChatUserSettings;
  handleMessageTypes?: ChatMessageType[];
  role?: ChatUserRole; // TODO: Refactor this with a RBAC system
};

export type ChatModel = {
  id: string;
  name: string;
  initiator: string;
  createdDate: Date | string;
  messages?: ChatMessageModel[];
  members: ChatUser[];
};
