import { UniqueId } from '@hubai/core';
import { IActionBarItemProps } from '@hubai/core/esm/components';

export enum ChatEvent {
  onListUpdated = 'chat.onListUpdated',
  onMessageReceived = 'chat.onMessageReceived',
}

export type SendChatMessageOptions = {
  chatId: string;
  message: string;
  sender: string;
};

export interface IChatItem {
  id: UniqueId;
  displayName: string;
  lastActivityText?: string;
  lastActivityDate: Date;
  avatars?: string[];
}

export interface IChatGroup {
  id: UniqueId;
  name: string;
  items: IChatItem[];
  activeItem?: IChatItem;
}

export interface IChatState {
  headerToolBar?: IActionBarItemProps[];
  chats: IChatItem[];
  activeItem?: IChatItem;
}

export class ChatStateModel implements IChatState {
  headerToolBar?: IActionBarItemProps<any>[];

  chats: IChatItem[] = [];

  activeItem?: IChatItem | undefined;

  constructor(
    headerToolBar: IActionBarItemProps<any>[] = [],
    chats: IChatItem[] = [],
    activeItem: IChatItem | undefined = undefined
  ) {
    this.headerToolBar = headerToolBar;
    this.chats = chats;
    this.activeItem = activeItem;
  }
}
