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

export interface IChatLastActivityViewModel {
  senderName: string;
  text: string;
  date: string;
}

export interface IChatItem {
  id: UniqueId;
  displayName: string;
  lastActivity: IChatLastActivityViewModel;
  createdDate: string;
  avatars?: string[];
}

export interface IChatGroup {
  id: UniqueId;
  name: string;
  items: IChatItem[];
  activeItem?: IChatItem;
}

export type IChatState = object;

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
