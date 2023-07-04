/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
import { ChatBrain, ChatModel } from 'api-server/chat/domain/models/chat';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { container } from 'tsyringe';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import {
  BrainManagementService,
  IBrainManagementService,
} from 'renderer/features/brain/services/brainManagement';
import { Component } from '@hubai/core/esm/react';
import {
  ChatWindowMessage,
  ChatWindowStateModel,
  IChatWindowState,
} from '../models/chatWindow';
import { ChatService, IChatMessageSubscriber } from './chat';

export interface IChatWindowService extends Component<IChatWindowState> {
  setMessages(messages: ChatWindowMessage[]): void;
  sendMessage(message: SendChatMessageModel): Promise<void>;
  updateChatBrains(brains: ChatBrain[]): Promise<void>;
}

export class ChatWindowService
  extends Component<IChatWindowState>
  implements IChatWindowService, IChatMessageSubscriber
{
  protected state: IChatWindowState;

  private chatService: ChatService;

  private brainService: IBrainManagementService;

  constructor(private readonly chat: ChatModel) {
    super();
    this.brainService = container.resolve(BrainManagementService);
    this.state = new ChatWindowStateModel(
      [],
      this.brainService.getBrains(),
      chat.brains
    );
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

  onMessageUpdated(
    prevMessage: ChatMessageModel,
    message: ChatMessageModel
  ): void {
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
    await this.chatService.sendChatMessage(message);
  }

  async updateChatBrains(brains: ChatBrain[]): Promise<void> {
    const updatedChat = await this.chatService.updateChatBrains({
      chatId: this.chat.id,
      brains,
    });

    this.setState({ selectedBrains: updatedChat.brains });
  }
}
