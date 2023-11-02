/* eslint-disable import/prefer-default-export */
import { ChatMessageModel } from './chatMessage';

export type ChatContextUser = {
  id: string;
  name: string;
  avatar?: string;
  isTyping?: boolean;
};

export class ChatMessagesContext {
  messages: ChatMessageModel[];

  users?: Record<string, ChatContextUser>;

  constructor(
    messages: ChatMessageModel[],
    users?: Record<string, ChatContextUser>
  ) {
    this.messages = messages;
    this.users = users;
  }
}
