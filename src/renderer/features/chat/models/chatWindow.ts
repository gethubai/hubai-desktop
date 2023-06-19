import { ChatBrain } from 'api-server/chat/domain/models/chat';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';

export type ChatWindowMessage = ChatMessageModel & {};

export interface IChatWindowState {
  messages: ChatWindowMessage[];
  brains: ChatBrain[];
  addMessage(message: ChatWindowMessage): void;
  updateMessage(message: ChatMessageModel): void;
}

export class ChatWindowStateModel implements IChatWindowState {
  messages: ChatWindowMessage[];

  brains: ChatBrain[];

  constructor(messages: ChatWindowMessage[] = [], brains: ChatBrain[] = []) {
    this.messages = messages;
    this.brains = brains;
  }

  addMessage(message: ChatWindowMessage) {
    // check if message already exists
    const index = this.messages.findIndex((m) => m.id === message.id);
    if (index === -1) {
      this.messages.push(message);
    }
  }

  updateMessage(message: ChatMessageModel) {
    const index = this.messages.findIndex((m) => m.id === message.id);
    if (index !== -1) {
      this.messages[index] = message;
    }
  }
}
