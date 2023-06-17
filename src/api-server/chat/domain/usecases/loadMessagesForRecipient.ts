import { ChatMessagesContext } from '../models/chatContext';
import { ChatMessageStatus } from '../models/chatMessage';

export interface LoadMessageForRecipient {
  loadMessages: (
    params: LoadMessageForRecipient.Params
  ) => Promise<LoadMessageForRecipient.Model[]>;
}

export namespace LoadMessageForRecipient {
  export type Params = {
    recipientId: string;
    messageStatus?: ChatMessageStatus;
  };
  // Dictionary, where key is chatId and value is array of messages
  export type Model = ChatMessagesContext;
}
