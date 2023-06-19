import { ChatMessageModel, ChatMessageType } from './chatMessage';

export type ChatBrain = {
  id: string;
  handleMessageType: ChatMessageType;
};

export type ChatModel = {
  id: string;
  name: string;
  initiator: string;
  createdDate: Date | string;
  messages?: ChatMessageModel[];
  brains: ChatBrain[];
};
