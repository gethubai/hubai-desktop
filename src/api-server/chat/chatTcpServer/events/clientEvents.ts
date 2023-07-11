import { ChatModel } from 'api-server/chat/domain/models/chat';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { UpdateChatBrains } from '../../domain/usecases/updateChatBrains';

export namespace JoinChatEvent {
  export const Name = 'join';
  export type Params = {
    chatId: string;
  };
  export type Callback = (messages: ChatMessagesContext) => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export namespace SendMessageEvent {
  export const Name = 'message:send';
  export type Params = SendChatMessageModel;
  export type Callback = (messageCreated: ChatMessageModel) => void;
  export type Emitter = (params: Params, callback?: Callback) => void;
}

export namespace GetMessagesEvent {
  export const Name = 'messages';
  export type Params = {
    recipientId: string;
  };
  export type Callback = (messages: ChatMessagesContext[]) => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export namespace MessagesReceivedAckEvent {
  export const Name = 'message:receivedAck';
  export type Params = {
    messages: ChatMessageModel[];
  };
  export type Emitter = (params: Params) => void;
}

export namespace CreateChatEvent {
  export const Name = 'create';
  export type Params = CreateChat.Params;
  export type Callback = (chat: ChatModel) => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export namespace TranscribeVoiceMessageEvent {
  export const Name = 'message:transcribeVoice';
  export type Params = {
    message: ChatMessageModel;
    transcription: string;
  };
  export type Callback = () => void;
  export type Emitter = (params: Params, callback?: Callback) => void;
}

export namespace GetChatEvent {
  export const Name = 'get';
  export type Params = string;
  export type Callback = (chat: ChatModel) => void;
  export type Emitter = (chatId: Params, callback: Callback) => void;
}

export namespace UpdateChatBrainsEvent {
  export const Name = 'brains:update';
  export type Params = UpdateChatBrains.Params;
  export type Callback = (chat: ChatModel) => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export interface ClientToServerEvents {
  [JoinChatEvent.Name]: JoinChatEvent.Emitter;
  [SendMessageEvent.Name]: SendMessageEvent.Emitter;
  [GetMessagesEvent.Name]: GetMessagesEvent.Emitter;
  [MessagesReceivedAckEvent.Name]: MessagesReceivedAckEvent.Emitter;
  [CreateChatEvent.Name]: CreateChatEvent.Emitter;
  [TranscribeVoiceMessageEvent.Name]: TranscribeVoiceMessageEvent.Emitter;
  [GetChatEvent.Name]: GetChatEvent.Emitter;
  [UpdateChatBrainsEvent.Name]: UpdateChatBrainsEvent.Emitter;
}
