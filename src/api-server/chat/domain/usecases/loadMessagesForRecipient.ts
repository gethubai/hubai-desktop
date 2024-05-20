import { ChatMessagesContext } from '../models/chatContext';
import { ChatMessageStatus } from '../models/chatMessage';

export type LoadMessageForRecipientParams = {
  recipientId: string;
  chatId?: string;
  messageStatus?: ChatMessageStatus;
};
// Dictionary, where key is chatId and value is array of messages
export type LoadMessageForRecipientModel = ChatMessagesContext;

export interface LoadMessageForRecipient {
  loadMessages: (
    params: LoadMessageForRecipientParams
  ) => Promise<LoadMessageForRecipientModel[]>;
}
