import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';

export namespace MessagesReceivedAckEvent {
  export const Name = 'chat/?/message/receivedAck';
  export type Params = {
    messages: ChatMessageModel[];
  };
  export type Emitter = (params: Params) => void;
}

export namespace TranscribeVoiceMessageEvent {
  export const Name = 'chat/?/message/transcribeVoice';
  export type Params = {
    message: ChatMessageModel;
    transcription: string;
  };
  export type Callback = () => void;
  export type Emitter = (params: Params, callback?: Callback) => void;
}

export interface SessionClientToServerEvents {
  [MessagesReceivedAckEvent.Name]: MessagesReceivedAckEvent.Emitter;
  [TranscribeVoiceMessageEvent.Name]: TranscribeVoiceMessageEvent.Emitter;
}
