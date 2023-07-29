import { ChatModel } from 'api-server/chat/domain/models/chat';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';

export namespace MessageUpdatedEvent {
  export const Name = ':user/chat/:chatId/message/updated';

  export type Params = {
    prevMessage?: ChatMessageModel;
    message: ChatMessageModel;
  };

  export type Emitter = (params: Params) => void;
}

export namespace MessageReceivedEvent {
  export const Name = ':user/chat/:chatId/message/onReceived';
  export type Params = ChatMessageModel;

  export type Callback = () => void;
  export type Emitter = (params: Params) => void;
}

export namespace MessageReceivedNotificationEvent {
  export const Name = ':user/notification/:user/message/onReceived';
  export type Params = ChatMessageModel;

  export type Callback = () => void;
  export type Emitter = (params: Params) => void;
}

export namespace MessageTranscribedEvent {
  export const Name = ':user/chat/:chatId/message/onTranscribed';
  export type Params = ChatMessageModel;

  export type Emitter = (params: Params) => void;
}

export namespace MessageSentEvent {
  export const Name = ':user/chat/:chatId/message/onSent';
  export type Params = ChatMessageModel;

  export type Emitter = (params: Params) => void;
}

export namespace ChatUpdatedEvent {
  export const Name = ':user/chat/:chatId/onUpdate';
  export type Params = ChatModel;

  export type Callback = () => void;
  export type Emitter = (params: Params) => void;
}

export namespace LeftChatEvent {
  export const Name = ':user/chat/onLeft';
  export type Params = ChatModel;

  export type Callback = () => void;
  export type Emitter = (params: Params) => void;
}

export namespace JoinChatEvent {
  export const Name = ':user/chat/onJoined';
  export type Params = ChatModel;

  export type Callback = () => void;
  export type Emitter = (params: Params) => void;
}

export interface SessionServerToClientEvents {
  [MessageUpdatedEvent.Name]: MessageUpdatedEvent.Emitter;
  [MessageReceivedEvent.Name]: MessageReceivedEvent.Emitter;
  [MessageSentEvent.Name]: MessageSentEvent.Emitter;
  [MessageTranscribedEvent.Name]: MessageTranscribedEvent.Emitter;
  [ChatUpdatedEvent.Name]: ChatUpdatedEvent.Emitter;
  [LeftChatEvent.Name]: LeftChatEvent.Emitter;
  [JoinChatEvent.Name]: JoinChatEvent.Emitter;
}
