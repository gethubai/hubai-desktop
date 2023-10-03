import { container } from 'tsyringe';
import { IActionBarItemProps } from '@hubai/core/esm/components';
import { Component } from '@hubai/core/esm/react';
import { IContactService } from 'renderer/features/contact/models/service';
import { Contact } from 'api-server/contact/domain/models/contact';
import {
  ChatActivityKind,
  ChatMemberType,
  ChatModel,
} from 'api-server/chat/domain/models/chat';
import { IChatItem, IChatLastActivityViewModel } from '../models/chat';

export interface IChatListState {
  headerToolBar?: IActionBarItemProps[];
  chats: IChatItem[];
  title: string;
}

export class ChatListService extends Component<IChatListState> {
  protected state: IChatListState;

  private readonly contactService: IContactService;

  constructor(title: string) {
    super();
    this.state = {
      chats: [],
      title,
    };

    this.contactService = container.resolve('IContactService');
  }

  setChats(chats: ChatModel[]): void {
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

  getContactsDictionary(): Record<string, Contact> {
    return this.contactService.list().reduce((acc, obj) => {
      acc[obj.id] = obj;
      return acc;
    }, {} as Record<string, Contact>);
  }

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

  getChat(id: string): IChatItem | undefined {
    return this.state.chats.find((c) => c.id === id);
  }
}
