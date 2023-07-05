import { ChatMessageModel, ChatMessageStatus } from '../models/chatMessage';

export interface UpdateMessageStatus {
  update: (
    params: UpdateMessageStatus.Params
  ) => Promise<UpdateMessageStatus.Model>;
}

export namespace UpdateMessageStatus {
  // Id of the message
  export type Params = {
    messageIds: string[];
    newStatus: ChatMessageStatus;
  };

  export type Model = ChatMessageModel[];
}
