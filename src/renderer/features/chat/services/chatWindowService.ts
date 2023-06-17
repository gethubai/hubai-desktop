/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
import { Component } from 'mo/react';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { container } from 'tsyringe';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import {
  ChatWindowMessage,
  ChatWindowStateModel,
  IChatWindowState,
} from '../models/chatWindow';
import { ChatService, IChatMessageSubscriber } from './chat';

export interface IChatWindowService extends Component<IChatWindowState> {
  setMessages(messages: ChatWindowMessage[]): void;
  sendMessage(message: SendChatMessageModel): Promise<void>;
}

export class ChatWindowService
  extends Component<IChatWindowState>
  implements IChatWindowService, IChatMessageSubscriber
{
  protected state: IChatWindowState;

  private chatService: ChatService;

  constructor(private readonly chat: ChatModel) {
    super();
    this.state = new ChatWindowStateModel();
    this.chatService = container.resolve(ChatService);
    this.initServer();
  }

  private async initServer(): Promise<void> {
    this.chatService.addChatSubscriber(this.chat.id, this);
  }

  onMessagesLoaded(messages: ChatMessagesContext): void {
    this.setMessages(messages.messages as ChatWindowMessage[]);
  }

  onMessageSent(message: ChatMessageModel): void {
    const { state } = this;
    state.addMessage(message);
    this.setState(state);
  }

  onMessageReceived(message: ChatMessageModel): void {
    const { state } = this;
    state.addMessage(message);
    this.setState(state);
  }

  onMessageUpdated(message: ChatMessageModel): void {
    const { state } = this;
    state.updateMessage(message);
    this.setState(state);
  }

  setMessages(messages: ChatWindowMessage[]): void {
    const { state } = this;
    messages.forEach((message) => {
      state.addMessage(message);
    });

    this.setState(state);
  }

  async sendMessage(message: SendChatMessageModel): Promise<void> {
    this.chatService.sendChatMessage(message);
  }
}
