/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
import { singleton, container } from 'tsyringe';
import { Component } from 'mo/react';

import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import { Socket } from 'socket.io';
import { io } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { UpdateChatBrains } from 'api-server/chat/domain/usecases/updateChatBrains';
import {
  ChatStateModel,
  IChatGroup,
  IChatItem,
  IChatState,
} from '../models/chat';

export interface IChatService extends Component<IChatState> {
  createChat(options: CreateChat.Params): Promise<ChatModel | undefined>;
  updateChatBrains(
    options: UpdateChatBrains.Params
  ): Promise<ChatModel | undefined>;
  sendChatMessage(options: SendChatMessageModel): Promise<ChatMessageModel>;
  getServer(): Socket<any, any> | undefined;
  getChatCount(): number;
  getChat(id: string): Promise<ChatModel>;
}

export interface IChatMessageSubscriber {
  onMessageSent(message: ChatMessageModel): void;
  onMessagesLoaded(chat: ChatMessagesContext): void;
  onMessageUpdated(
    prevMessage: ChatMessageModel,
    message: ChatMessageModel
  ): void;
  onMessageReceived(message: ChatMessageModel): void;
}

@singleton()
export class ChatService extends Component<IChatState> implements IChatService {
  protected state: IChatState;

  private socket: Socket | undefined;

  private subscribers: Record<string, IChatMessageSubscriber> = {};

  constructor() {
    super();
    this.state = container.resolve(ChatStateModel);
    this.initCommands();
    this.initServer();
  }

  getServer(): Socket<any, any, DefaultEventsMap, any> | undefined {
    return this.socket;
  }

  private async initCommands(): Promise<void> {}

  private async initServer(): Promise<void> {
    this.socket = io('http://localhost:4114', {
      query: {
        type: 'chatClient',
        id: '1', // TODO: change to user id
      },
    });

    this.socket?.on('messageSent', (message: ChatMessageModel) => {
      if (this.subscribers[message.chat]) {
        this.subscribers[message.chat].onMessageSent(message);
      }
    });

    this.socket?.on('messageUpdated', ({ prevMessage, message }) => {
      if (this.subscribers[message.chat]) {
        this.subscribers[message.chat].onMessageUpdated(prevMessage, message);
      }
    });

    this.socket?.on(
      'messageReceived',
      (message: ChatMessageModel, callback) => {
        // this.socket?.emit('messagesReceivedAck', { messages: [message] });
        if (this.subscribers[message.chat]) {
          this.subscribers[message.chat].onMessageReceived(message);
        }
        callback?.();
      }
    );

    this.socket?.on('chatsLoaded', ({ chats }) => {
      this.onListUpdated(chats.map((c) => c.chat));
    });

    this.socket?.on('chatCreated', (chat) => {
      this.onListUpdated([chat]);
    });
  }

  public addChatSubscriber(
    chatId: string,
    subscriber: IChatMessageSubscriber
  ): void {
    this.subscribers[chatId] = subscriber;
    this.socket?.emit('join', { chatId }, (response: ChatMessagesContext) => {
      if (this.subscribers[chatId]) {
        this.subscribers[chatId].onMessagesLoaded(response);
      }
    });
  }

  onListUpdated(chats: ChatModel[]): void {
    const groups: IChatGroup[] = this.state.groups || [];
    chats.forEach((chat) => {
      const group = groups.find((g) => g.name === chat.initiator);
      const chatListItem = {
        id: chat.id,
        name: chat.name,
        createdDate: chat.createdDate,
        brains: chat.brains,
      } as IChatItem;

      if (group) {
        // use a guid on the id
        group.items.push(chatListItem);
      } else {
        groups.push({
          id: generateUniqueId(),
          name: chat.initiator,
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
      this.socket?.emit('createChat', options, (response: ChatModel) => {
        if (!response) {
          reject(new Error('Chat could not be created'));
        } else {
          resolve(response);
        }
      });
    });
  }

  sendChatMessage(options: SendChatMessageModel): Promise<ChatMessageModel> {
    return new Promise((resolve, reject) => {
      this.socket?.emit(
        'sendMessage',
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
      this.socket?.emit('updateChatBrains', options, (response: ChatModel) => {
        if (!response) {
          reject(new Error('Chat brains could not be updated'));
        } else {
          resolve(response);
        }
      });
    });
  }

  getChat(id: string): Promise<ChatModel> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('getChat', id, (response: ChatModel) => {
        if (!response) {
          reject(new Error('Chat could not be found'));
        } else {
          resolve(response);
        }
      });
    });
  }
}
