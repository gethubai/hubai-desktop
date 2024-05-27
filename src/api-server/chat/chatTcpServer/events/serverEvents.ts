import { ChatModel } from 'api-server/chat/domain/models/chat';
import {
  MessageUpdatedEventName,
  SessionServerToClientEvents,
  MessageReceivedEventName,
  MessageSentEventName,
  MessageTranscribedEventName,
  ChatUpdatedEventName,
  LeftChatEventName,
  JoinChatEventName,
  ChatMemberStatusChangedEventName,
} from './serveSessionEvents';

export const ChatCreatedEventName = 'user/:user/chat/created';
export type ChatCreatedEventParams = ChatModel;
export type ChatCreatedEventEmitter = (params: ChatCreatedEventParams) => void;

export interface ServerToClientEvents extends SessionServerToClientEvents {
  [ChatCreatedEventName]: ChatCreatedEventEmitter;
}

type KeysEnum<T> = { [P in keyof Required<T>]: true };

const serverToClientEventsKeys: KeysEnum<ServerToClientEvents> = {
  [ChatCreatedEventName]: true,
  [MessageUpdatedEventName]: true,
  [MessageReceivedEventName]: true,
  [MessageSentEventName]: true,
  [MessageTranscribedEventName]: true,
  [ChatUpdatedEventName]: true,
  [LeftChatEventName]: true,
  [JoinChatEventName]: true,
  [ChatMemberStatusChangedEventName]: true,
};

export const ServerToClientEventsName = Object.keys(serverToClientEventsKeys);
