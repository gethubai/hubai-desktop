import { ChatMessageModel, ChatMessageStatus } from '../models/chatMessage';

// Id of the message
export type UpdateMessageStatusParams = {
  messageIds: string[];
  newStatus: ChatMessageStatus;
};

export type UpdateMessageStatusModel = ChatMessageModel[];

export interface UpdateMessageStatus {
  update: (
    params: UpdateMessageStatusParams
  ) => Promise<UpdateMessageStatusModel>;
}
