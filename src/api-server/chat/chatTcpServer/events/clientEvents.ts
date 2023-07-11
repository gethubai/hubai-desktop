import { ChatModel } from 'api-server/chat/domain/models/chat';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import {
  ChatMessageModel,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { ChatServerConfigs } from 'api-server/consts';
import { UpdateChatBrains } from '../../domain/usecases/updateChatBrains';

export namespace JoinChatEvent {
  export type Params = {
    chatId: string;
  };

  export type Callback = (messages: ChatMessagesContext) => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export namespace SendMessageEvent {
  export type Params = SendChatMessageModel;

  export type Callback = (messageCreated: ChatMessageModel) => void;
  export type Emitter = (params: Params, callback?: Callback) => void;
}

export namespace GetMessagesEvent {
  export type Params = {
    recipientId: string;
  };

  export type Callback = (messages: ChatMessagesContext[]) => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export namespace MessagesReceivedAckEvent {
  export type Params = {
    messages: ChatMessageModel[];
  };

  export type Emitter = (params: Params) => void;
}

export namespace CreateChatEvent {
  export type Params = CreateChat.Params;

  export type Callback = (chat: ChatModel) => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export namespace TranscribeVoiceMessageEvent {
  export type Params = {
    message: ChatMessageModel;
    transcription: string;
  };

  export type Callback = () => void;
  export type Emitter = (params: Params, callback?: Callback) => void;
}

export namespace GetChatEvent {
  export type Params = string;

  export type Callback = (chat: ChatModel) => void;
  export type Emitter = (chatId: Params, callback: Callback) => void;
}

export namespace UpdateChatBrainsEvent {
  export type Params = UpdateChatBrains.Params;

  export type Callback = (chat: ChatModel) => void;
  export type Emitter = (params: Params, callback: Callback) => void;
}

export interface ClientToServerEvents {
  [ChatServerConfigs.endpoints.join]: JoinChatEvent.Emitter;
  [ChatServerConfigs.endpoints.sendMessage]: SendMessageEvent.Emitter;
  [ChatServerConfigs.endpoints.getMessages]: GetMessagesEvent.Emitter;
  [ChatServerConfigs.endpoints
    .messageReceivedAck]: MessagesReceivedAckEvent.Emitter;
  [ChatServerConfigs.endpoints.createChat]: CreateChatEvent.Emitter;
  [ChatServerConfigs.endpoints.getChat]: GetChatEvent.Emitter;
  [ChatServerConfigs.endpoints
    .transcribeVoiceMessage]: TranscribeVoiceMessageEvent.Emitter;
  [ChatServerConfigs.endpoints.updateChatBrains]: UpdateChatBrainsEvent.Emitter;
}
