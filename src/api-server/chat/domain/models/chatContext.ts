/* eslint-disable import/prefer-default-export */
import { ChatModel } from './chat';
import { ChatMessageModel } from './chatMessage';

export class ChatMessagesContext {
  messages: ChatMessageModel[];

  chat: ChatModel;

  constructor(chat: ChatModel, messages: ChatMessageModel[]) {
    this.messages = messages;
    this.chat = chat;
  }
}
