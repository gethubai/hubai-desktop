import { ChatMessageModel, ChatMessageType } from './chatMessage';

export interface IBrainScopedSettings {
  [settingId: string]: any;
}

export type ChatBrain = {
  id: string;
  handleMessageType: ChatMessageType;
  scopedSettings?: IBrainScopedSettings;
};

export type ChatModel = {
  id: string;
  name: string;
  initiator: string;
  createdDate: Date | string;
  messages?: ChatMessageModel[];
  brains: ChatBrain[];
};
