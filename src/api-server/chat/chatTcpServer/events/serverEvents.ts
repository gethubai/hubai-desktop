import { ChatModel } from 'api-server/chat/domain/models/chat';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import { ChatServerConfigs } from 'api-server/consts';

export namespace ChatListEvent {
  export type Params = {
    chats: ChatMessagesContext[];
  };

  export type Emitter = (params: Params) => void;
}

export namespace ChatCreatedEvent {
  export type Params = ChatModel;

  export type Emitter = (params: Params) => void;
}

export namespace MessageUpdatedEvent {
  export type Params = {
    prevMessage: ChatMessageModel;
    message: ChatMessageModel;
  };

  export type Emitter = (params: Params) => void;
}

export namespace MessageReceivedEvent {
  export type Params = ChatMessageModel;

  export type Callback = () => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export namespace MessageTranscribedEvent {
  export type Params = ChatMessageModel;

  export type Emitter = (params: Params) => void;
}

export namespace MessageSentEvent {
  export type Params = ChatMessageModel;

  export type Emitter = (params: Params) => void;
}

export interface ServerToClientEvents {
  [ChatServerConfigs.endpoints.chatList]: ChatListEvent.Emitter;
  [ChatServerConfigs.events.chatCreated]: ChatCreatedEvent.Emitter;
  [ChatServerConfigs.events.messageUpdated]: MessageUpdatedEvent.Emitter;
  [ChatServerConfigs.events.messageReceived]: MessageReceivedEvent.Emitter;
  [ChatServerConfigs.events.messageSent]: MessageSentEvent.Emitter;
  [ChatServerConfigs.events
    .messageTranscribed]: MessageTranscribedEvent.Emitter;
}
