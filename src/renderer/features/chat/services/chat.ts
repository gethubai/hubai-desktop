/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
import { container, inject, injectable } from 'tsyringe';

import {
  ChatActivityKind,
  ChatMemberType,
  ChatModel,
} from 'api-server/chat/domain/models/chat';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { Component } from '@hubai/core/esm/react';
import { type ILocalUserService } from 'renderer/features/user/services/userService';
import { IChatCommandCompletion } from '@hubai/core/esm/model/chat';
import { type IContactService } from 'renderer/features/contact/models/service';
import { Contact } from 'api-server/contact/domain/models/contact';
import {
  ChatStateModel,
  IChatItem,
  IChatLastActivityViewModel,
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

  private chatCommands: IChatCommandCompletion = {};

  constructor(
    @inject('ILocalUserService')
    private readonly localUserService: ILocalUserService,
    @inject('IContactService') private readonly contactService: IContactService
  ) {
    super();
    this.state = container.resolve(ChatStateModel);
    this.chatClient = new ChatClient();
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

    this.refreshChatList();

    this.chatClient.onChatCreated(() => {
      this.refreshChatList();
    });

    this.chatClient.onChatUpdated((chat) => {
      const { chats } = this.getState();

      // Check if the chat is already in the list
      const index = chats.findIndex((c) => c.id === chat.id);

      if (index >= 0) {
        chats[index] = this.parseChat(chat);

        // Remove the updated chat from its current position
        const updatedChat = chats.splice(index, 1)[0];

        // Insert the updated chat at the first position
        chats.unshift(updatedChat);

        this.setState({ chats });
      }
      // TODO: Should we add the chat if it's not in the list?
    });
  }

  refreshChatList(): void {
    this.chatClient
      .chats()
      .then(this.onListUpdated.bind(this))
      .catch((err) => {
        // TODO: Display error
        console.error('Could not refresh chatlist', err);
      });
  }

  getContactsDictionary(): Record<string, Contact> {
    return this.contactService.list().reduce((acc, obj) => {
      acc[obj.id] = obj;
      return acc;
    }, {} as Record<string, Contact>);
  }

  /*
    Receives an array of names like "jose", "maria" and format it to string:
    ["jose", "maria"] => "jose and maria"
    ["jose", "maria", "pedro"] => "jose, maria and pedro"
    ["jose"] => "jose"
    [] => ""
  */
  formatNames(names?: string[], andText: string = 'and'): string {
    if (!names) return '';
    const { length } = names;

    if (length === 0) return '';
    if (length === 1) return names[0];
    if (length === 2) return `${names[0]} ${andText} ${names[1]}`;

    const allButLast = names.slice(0, length - 1).join(', ');
    const last = names[length - 1];
    return `${allButLast} ${andText} ${last}`;
  }

  parseChat(chat: ChatModel, contacts?: Record<string, Contact>): IChatItem {
    if (!contacts) {
      // eslint-disable-next-line no-param-reassign
      contacts = this.getContactsDictionary();
    }
    const brains = chat.members.filter(
      (m) => m.memberType === ChatMemberType.brain
    );

    let lastActivity: IChatLastActivityViewModel | undefined;

    if (chat.lastActivity) {
      const senderName =
        contacts?.[chat.lastActivity?.executorId]?.name ?? 'You';
      let text = `${chat.lastActivity?.value ?? ''}`;

      if (chat.lastActivity.kind === 'voiceMessage') {
        text = '🎤 Voice';
      }

      if (chat.lastActivity.kind === ChatActivityKind.imageMessage) {
        text = '📷 Image';
      }

      const date =
        chat.lastActivity.dateUtc instanceof Date
          ? chat.lastActivity.dateUtc.toISOString()
          : chat.lastActivity.dateUtc;

      lastActivity = { senderName, text, date };
    }

    return {
      id: chat.id,
      displayName:
        this.formatNames(
          brains.map((m) => contacts?.[m.id]?.name ?? 'Unknown')
        ) || 'New Chat',
      lastActivity,
      members: chat.members,
      createdDate: chat.createdDate.toString(),
      avatars:
        brains.length === 0
          ? ['']
          : brains.map((m) => contacts?.[m.id]?.avatar ?? ''),
    } as IChatItem;
  }

  onListUpdated(chats: ChatModel[]): void {
    const contacts: Record<string, Contact> = this.getContactsDictionary();

    const parseDate = (date: string | Date): Date => {
      return typeof date === 'string' ? new Date(date) : date;
    };

    // TODO: Change to use last activity date
    const chatsParsed = chats
      .sort(
        (a, b) =>
          parseDate(b.lastActivity?.dateUtc ?? b.createdDate).getTime() -
          parseDate(a.lastActivity?.dateUtc ?? a.createdDate).getTime()
      )
      .map((chat) => this.parseChat(chat, contacts));

    this.setState({ chats: chatsParsed });
  }

  getChatCount(): number {
    return this.getState().chats.length;
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
