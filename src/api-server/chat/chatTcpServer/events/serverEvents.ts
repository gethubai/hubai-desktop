import { ChatModel } from 'api-server/chat/domain/models/chat';
import {
  ChatUpdatedEvent,
  JoinChatEvent,
  LeftChatEvent,
  MessageReceivedEvent,
  MessageSentEvent,
  MessageTranscribedEvent,
  MessageUpdatedEvent,
  SessionServerToClientEvents,
} from './serveSessionEvents';

export namespace ChatCreatedEvent {
  export const Name = 'user/:user/chat/created';
  export type Params = ChatModel;

  export type Emitter = (params: Params) => void;
}

export interface ServerToClientEvents extends SessionServerToClientEvents {
  [ChatCreatedEvent.Name]: ChatCreatedEvent.Emitter;
}

type KeysEnum<T> = { [P in keyof Required<T>]: true };

const serverToClientEventsKeys: KeysEnum<ServerToClientEvents> = {
  [ChatCreatedEvent.Name]: true,
  [MessageUpdatedEvent.Name]: true,
  [MessageReceivedEvent.Name]: true,
  [MessageSentEvent.Name]: true,
  [MessageTranscribedEvent.Name]: true,
  [ChatUpdatedEvent.Name]: true,
  [LeftChatEvent.Name]: true,
  [JoinChatEvent.Name]: true,
};

export const ServerToClientEventsName = Object.keys(serverToClientEventsKeys);
