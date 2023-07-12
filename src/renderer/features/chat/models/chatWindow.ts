import { ViewVisibility } from '@hubai/core/esm/model/workbench/layout';
import { LocalBrainModel } from 'api-server/brain/domain/models/localBrain';
import { ChatBrain } from 'api-server/chat/domain/models/chat';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';

export type ChatWindowMessage = ChatMessageModel & {};

export interface IChatWindowState {
  messages: ChatWindowMessage[];
  availableBrains: LocalBrainModel[];
  selectedBrains: ChatBrain[];
  auxiliaryBarView: ViewVisibility;
  addMessage(message: ChatWindowMessage): void;
  updateMessage(message: ChatMessageModel): void;
}

export class ChatWindowStateModel implements IChatWindowState {
  messages: ChatWindowMessage[];

  availableBrains: LocalBrainModel[];

  selectedBrains: ChatBrain[] = [];

  auxiliaryBarView: ViewVisibility;

  constructor(
    messages: ChatWindowMessage[] = [],
    availableBrains: LocalBrainModel[] = [],
    selectedBrains: ChatBrain[] = []
  ) {
    this.messages = messages;
    this.availableBrains = availableBrains;
    this.selectedBrains = selectedBrains;
    this.auxiliaryBarView = { hidden: true };
  }

  addMessage(message: ChatWindowMessage) {
    // check if message already exists
    const index = this.messages.findIndex((m) => m.id === message.id);
    if (index === -1) {
      this.messages.push(message);
    }
  }

  updateMessage(message: ChatMessageModel) {
    const index = this.messages.findIndex((m) => m.id === message.id);
    if (index !== -1) {
      this.messages[index] = message;
    }
  }
}
