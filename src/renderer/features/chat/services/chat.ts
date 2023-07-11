/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
import { container, inject, injectable } from 'tsyringe';

import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import { io } from 'socket.io-client';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { UpdateChatBrains } from 'api-server/chat/domain/usecases/updateChatBrains';
import { Component } from '@hubai/core/esm/react';
import { type ILocalUserService } from 'renderer/features/user/services/userService';
import { ChatServerConfigs } from 'api-server/consts';
import { ChatClientSocket } from 'api-server/chat/chatTcpServer/models/serverClient';
import {
  ChatCreatedEvent,
  ChatListEvent,
  MessageReceivedEvent,
  MessageSentEvent,
  MessageUpdatedEvent,
  CreateChatEvent,
  GetChatEvent,
  JoinChatEvent,
  SendMessageEvent,
  UpdateChatBrainsEvent,
} from 'api-server/chat/chatTcpServer/events';
import {
  ChatStateModel,
  IChatGroup,
  IChatItem,
  IChatState,
} from '../models/chat';
import { IChatService } from './types';

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

  private socket: ChatClientSocket | undefined;

  private subscribers: Record<string, IChatMessageSubscriber> = {};

  constructor(
    @inject('ILocalUserService') private localUserService: ILocalUserService
  ) {
    super();
    this.state = container.resolve(ChatStateModel);
    this.initCommands();
    this.initServer();
  }

  getServer(): ChatClientSocket | undefined {
    return this.socket;
  }

  private async initCommands(): Promise<void> {}

  private async initServer(): Promise<void> {
    this.socket = io(ChatServerConfigs.address, {
      query: {
        type: 'chatClient',
        id: this.localUserService.getUser().id,
      },
    });

    this.socket?.on(MessageSentEvent.Name, (message: ChatMessageModel) => {
      if (this.subscribers[message.chat]) {
        this.subscribers[message.chat].onMessageSent(message);
      }
    });

    this.socket?.on(MessageUpdatedEvent.Name, ({ prevMessage, message }) => {
      if (this.subscribers[message.chat]) {
        this.subscribers[message.chat].onMessageUpdated(prevMessage, message);
      }
    });

    this.socket?.on(
      MessageReceivedEvent.Name,
      (message: ChatMessageModel, callback) => {
        // this.socket?.emit(MessagesReceivedAckEvent.Name, { messages: [message] });
        if (this.subscribers[message.chat]) {
          this.subscribers[message.chat].onMessageReceived(message);
        }
        callback?.();
      }
    );

    this.socket?.on(ChatListEvent.Name, ({ chats }) => {
      this.onListUpdated(chats.map((c) => c.chat));
    });

    this.socket?.on(ChatCreatedEvent.Name, (chat) => {
      this.onListUpdated([chat]);
    });
  }

  public addChatSubscriber(
    chatId: string,
    subscriber: IChatMessageSubscriber
  ): void {
    this.subscribers[chatId] = subscriber;
    this.socket?.emit(
      JoinChatEvent.Name,
      { chatId },
      (response: ChatMessagesContext) => {
        if (this.subscribers[chatId]) {
          this.subscribers[chatId].onMessagesLoaded(response);
        }
      }
    );
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
        brains: chat.brains,
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
    return new Promise((resolve, reject) => {
      this.socket?.emit(
        CreateChatEvent.Name,
        options,
        (response: ChatModel) => {
          if (!response) {
            reject(new Error('Chat could not be created'));
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  sendChatMessage(options: SendChatMessageModel): Promise<ChatMessageModel> {
    return new Promise((resolve, reject) => {
      this.socket?.emit(
        SendMessageEvent.Name,
        options,
        (response: ChatMessageModel) => {
          if (!response) {
            reject(new Error('Chat could not be created'));
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  updateChatBrains(options: UpdateChatBrains.Params): Promise<ChatModel> {
    return new Promise((resolve, reject) => {
      this.socket?.emit(
        UpdateChatBrainsEvent.Name,
        options,
        (response: ChatModel) => {
          if (!response) {
            reject(new Error('Chat brains could not be updated'));
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  getChat(id: string): Promise<ChatModel> {
    return new Promise((resolve, reject) => {
      this.socket?.emit(GetChatEvent.Name, id, (response: ChatModel) => {
        if (!response) {
          reject(new Error('Chat could not be found'));
        } else {
          resolve(response);
        }
      });
    });
  }
}
