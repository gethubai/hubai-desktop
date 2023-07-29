/* eslint-disable import/prefer-default-export */
import { ChatMessageModel } from './chatMessage';

export type ChatContextUser = {
  name: string;
  avatar?: string;
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
