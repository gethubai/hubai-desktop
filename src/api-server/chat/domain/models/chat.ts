import { ChatMessageModel } from './chatMessage';

export type ChatModel = {
  id: string;
  name: string;
  initiator: string;
  createdDate: Date | string;
  messages?: ChatMessageModel[];
};
