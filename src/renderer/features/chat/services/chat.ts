/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
import { container, inject, injectable } from 'tsyringe';

import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { ChatMemberType, ChatModel } from 'api-server/chat/domain/models/chat';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { Component } from '@hubai/core/esm/react';
import { type ILocalUserService } from 'renderer/features/user/services/userService';
import {
  ChatStateModel,
  IChatGroup,
  IChatItem,
  IChatState,
} from '../models/chat';
import { IChatService } from './types';
import { ChatClient } from '../sdk/chatClient';
import { IChatClient } from '../sdk/contracts';

export interface IChatMessageSubscriber {
  onMessageSent(message: ChatMessageModel): void;
  onMessagesLoaded(chat: ChatMessagesContext): void;
  onMessageUpdated(
    prevMessage: ChatMessageModel,
    message: ChatMessageModel
  ): void;
  onMessageReceived(message: ChatMessageModel): void;
}

@injectable()
export class ChatService extends Component<IChatState> implements IChatService {
  protected state: IChatState;

  private chatClient: IChatClient;

  constructor(
    @inject('ILocalUserService') private localUserService: ILocalUserService
  ) {
    super();
    this.state = container.resolve(ChatStateModel);
    this.chatClient = new ChatClient();
    this.initCommands();
    this.initServer();
  }

  private async initCommands(): Promise<void> {}

  private async initServer(): Promise<void> {
    const user = this.localUserService.getUser();
    await this.chatClient.connect({
      id: user.id,
      name: user.name,
      type: ChatMemberType.user,
    });

    const chatList = await this.chatClient.chats();
    this.onListUpdated(chatList);
    this.chatClient.onChatCreated((chat) => {
      this.onListUpdated([chat]);
    });
  }

  onListUpdated(chats: ChatModel[]): void {
    const groups: IChatGroup[] = this.state.groups || [];
    const user = this.localUserService.getUser();
    chats.forEach((chat) => {
      let groupName = chat.initiator;

      if (chat.initiator === user.id) {
        groupName = 'Your chats';
      }

      const group = groups.find((g) => g.name === groupName);
      const chatListItem = {
        id: chat.id,
        name: chat.name,
        createdDate: chat.createdDate,
        members: chat.members,
      } as IChatItem;

      if (group) {
        if (group.items.findIndex((i) => i.id === chat.id) === -1)
          group.items.push(chatListItem);
      } else {
        groups.push({
          id: generateUniqueId(),
          name: groupName,
          items: [chatListItem],
        });
      }
    });

    this.setState({ groups });
  }

  getChatCount(): number {
    const { groups } = this.state;
    return groups?.reduce((p, c) => p + c.items.length, 0) || 0;
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
