/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
import { container, inject, injectable } from 'tsyringe';

import { ChatMemberType, ChatModel } from 'api-server/chat/domain/models/chat';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { Component } from '@hubai/core/esm/react';
import { type ILocalUserService } from 'renderer/features/user/services/userService';
import { IChatCommandCompletion } from '@hubai/core/esm/model/chat';
import { ChatStateModel, IChatState } from '../models/chat';
import { type IChatService } from './types';
import { type IChatClient } from '../sdk/contracts';

@injectable()
export class ChatService extends Component<IChatState> implements IChatService {
  protected state: IChatState;

  private chatCommands: IChatCommandCompletion = {};

  constructor(
    @inject('ILocalUserService')
    private readonly localUserService: ILocalUserService,
    @inject('IChatClient') private readonly chatClient: IChatClient
  ) {
    super();
    this.state = container.resolve(ChatStateModel);
    this.initCommands();
    this.initServer();
  }

  getCompletionCommands(): IChatCommandCompletion {
    return this.chatCommands;
  }

  addCompletionCommand = (commands: IChatCommandCompletion): void => {
    this.chatCommands = { ...this.chatCommands, ...commands };
  };

  private async initCommands(): Promise<void> {}

  private async initServer(): Promise<void> {
    const user = this.localUserService.getUser();
    await this.chatClient.connect({
      id: user.id,
      name: user.name,
      type: ChatMemberType.user,
    });
  }

  async createChat(options: CreateChat.Params): Promise<ChatModel | undefined> {
    return this.chatClient.newChat(options);
  }

  getChat(id: string): Promise<ChatModel> {
    return this.chatClient.chat(id);
  }

  getClient(): IChatClient {
    return this.chatClient;
  }
}
