import { ViewVisibility } from '@hubai/core/esm/model/workbench/layout';
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { ChatUser } from 'api-server/chat/domain/models/chat';
import { ChatContextUser } from 'api-server/chat/domain/models/chatContext';
import { ChatMessageViewModel } from '../workbench/components/chat/types';

export interface IChatWindowState {
  id: string;
  messages: ChatMessageViewModel[];
  users: Record<string, ChatContextUser>;
  availableBrains: LocalBrainModel[];
  selectedBrains: ChatUser[];
  auxiliaryBarView: ViewVisibility;
  userId: string;
}

export class ChatWindowStateModel implements IChatWindowState {
  id: string;

  messages: ChatMessageViewModel[];

  availableBrains: LocalBrainModel[];

  selectedBrains: ChatUser[] = [];

  auxiliaryBarView: ViewVisibility;

  users: Record<string, ChatContextUser>;

  userId: string;

  constructor(
    id: string,
    userId: string,
    messages: ChatMessageViewModel[] = [],
    availableBrains: LocalBrainModel[] = [],
    selectedBrains: ChatUser[] = [],
    users: Record<string, ChatContextUser> | undefined = undefined
  ) {
    this.id = id;
    this.userId = userId;
    this.messages = messages;
    this.availableBrains = availableBrains;
    this.selectedBrains = selectedBrains;
    this.auxiliaryBarView = { hidden: true };
    this.users = users || {};
  }
}
