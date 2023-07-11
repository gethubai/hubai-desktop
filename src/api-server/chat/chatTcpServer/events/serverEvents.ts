import { ChatModel } from 'api-server/chat/domain/models/chat';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';

export namespace ChatListEvent {
  export const Name = 'list';

  export type Params = {
    chats: ChatMessagesContext[];
  };

  export type Emitter = (params: Params) => void;
}

export namespace ChatCreatedEvent {
  export const Name = 'events:created';
  export type Params = ChatModel;

  export type Emitter = (params: Params) => void;
}

export namespace MessageUpdatedEvent {
  export const Name = 'events:message:updated';

  export type Params = {
    prevMessage: ChatMessageModel;
    message: ChatMessageModel;
  };

  export type Emitter = (params: Params) => void;
}

export namespace MessageReceivedEvent {
  export const Name = 'events:message:received';
  export type Params = ChatMessageModel;

  export type Callback = () => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export namespace MessageTranscribedEvent {
  export const Name = 'events:message:transcribed';
  export type Params = ChatMessageModel;

  export type Emitter = (params: Params) => void;
}

export namespace MessageSentEvent {
  export const Name = 'events:message:sent';
  export type Params = ChatMessageModel;

  export type Emitter = (params: Params) => void;
}

export interface ServerToClientEvents {
  [ChatListEvent.Name]: ChatListEvent.Emitter;
  [ChatCreatedEvent.Name]: ChatCreatedEvent.Emitter;
  [MessageUpdatedEvent.Name]: MessageUpdatedEvent.Emitter;
  [MessageReceivedEvent.Name]: MessageReceivedEvent.Emitter;
  [MessageSentEvent.Name]: MessageSentEvent.Emitter;
  [MessageTranscribedEvent.Name]: MessageTranscribedEvent.Emitter;
}
