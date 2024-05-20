import {
  ChatMemberStatus,
  ChatModel,
} from 'api-server/chat/domain/models/chat';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';

export const MessageUpdatedEventName = ':user/chat/:chatId/message/updated';
export type MessageUpdatedEventParams = {
  prevMessage?: ChatMessageModel;
  message: ChatMessageModel;
};
export type MessageUpdatedEventEmitter = (
  params: MessageUpdatedEventParams
) => void;

export const MessageReceivedEventName = ':user/chat/:chatId/message/onReceived';
export type MessageReceivedEventParams = ChatMessageModel;
export type MessageReceivedEventCallback = () => void;
export type MessageReceivedEventEmitter = (
  params: MessageReceivedEventParams
) => void;

export const MessageReceivedNotificationEventName =
  ':user/notification/:user/message/onReceived';
export type MessageReceivedNotificationEventParams = ChatMessageModel;
export type MessageReceivedNotificationEventCallback = () => void;
export type MessageReceivedNotificationEventEmitter = (
  params: MessageReceivedNotificationEventParams
) => void;

export const MessageTranscribedEventName =
  ':user/chat/:chatId/message/onTranscribed';
export type MessageTranscribedEventParams = ChatMessageModel;
export type MessageTranscribedEventEmitter = (
  params: MessageTranscribedEventParams
) => void;

export const MessageSentEventName = ':user/chat/:chatId/message/onSent';
export type MessageSentEventParams = ChatMessageModel;
export type MessageSentEventEmitter = (params: MessageSentEventParams) => void;

export const ChatUpdatedEventName = ':user/chat/:chatId/onUpdate';
export type ChatUpdatedEventParams = ChatModel;
export type ChatUpdatedEventCallback = () => void;
export type ChatUpdatedEventEmitter = (params: ChatUpdatedEventParams) => void;

export const LeftChatEventName = ':user/chat/onLeft';
export type LeftChatEventParams = ChatModel;
export type LeftChatEventCallback = () => void;
export type LeftChatEventEmitter = (params: LeftChatEventParams) => void;

export const JoinChatEventName = ':user/chat/onJoined';
export type JoinChatEventParams = ChatModel;
export type JoinChatEventCallback = () => void;
export type JoinChatEventEmitter = (params: JoinChatEventParams) => void;

export const ChatMemberStatusChangedEventName =
  ':user/chat/:chatId/statusChanged';
export type ChatMemberStatusChangedEventParams = {
  userId: string;
  status: ChatMemberStatus;
};
export type ChatMemberStatusChangedEventCallback = () => void;
export type ChatMemberStatusChangedEventEmitter = (
  params: ChatMemberStatusChangedEventParams
) => void;

export interface SessionServerToClientEvents {
  [MessageUpdatedEventName]: MessageUpdatedEventEmitter;
  [MessageReceivedEventName]: MessageReceivedEventEmitter;
  [MessageSentEventName]: MessageSentEventEmitter;
  [MessageTranscribedEventName]: MessageTranscribedEventEmitter;
  [ChatUpdatedEventName]: ChatUpdatedEventEmitter;
  [LeftChatEventName]: LeftChatEventEmitter;
  [JoinChatEventName]: JoinChatEventEmitter;
  [ChatMemberStatusChangedEventName]: ChatMemberStatusChangedEventEmitter;
}
