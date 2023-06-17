import { UniqueId } from 'mo/common/types';
import { IActionBarItemProps } from 'mo/components';

export enum ChatEvent {
  onListUpdated = 'chat.onListUpdated',
  onMessageReceived = 'chat.onMessageReceived',
}

export type CreateChatOptions = {
  name: string;
  initiator: string;
};

export type SendChatMessageOptions = {
  chatId: string;
  message: string;
  sender: string;
};

export interface IChatItem {
  id: UniqueId;
  name: string;
  createdDate: Date;
}

export interface IChatGroup {
  id: UniqueId;
  name: string;
  items: IChatItem[];
  activeItem?: IChatItem;
}

export interface IChatState {
  headerToolBar?: IActionBarItemProps[];
  groups?: IChatGroup[];
  activeGroup?: IChatGroup;
}

export class ChatStateModel implements IChatState {
  groups: IChatGroup[] = [];

  headerToolBar?: IActionBarItemProps<any>[];

  activeGroup?: IChatGroup | undefined;

  constructor(
    groups: IChatGroup[] = [],
    headerToolBar: IActionBarItemProps<any>[] = [],
    activeGroup: IChatGroup | undefined = undefined
  ) {
    this.groups = groups;
    this.headerToolBar = headerToolBar;
    this.activeGroup = activeGroup;
  }
}
// CONTROLLER BASICAMENTE SÓ INICIA A UI
// SERVICE QUE CONTROLA STATE, ETC
