import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';

export const MessagesReceivedAckEventName = 'chat/?/message/receivedAck';
export type MessagesReceivedAckEventParams = {
  messages: ChatMessageModel[];
};
export type MessagesReceivedAckEventEmitter = (
  params: MessagesReceivedAckEventParams
) => void;

export const TranscribeVoiceMessageEventName = 'chat/?/message/transcribeVoice';
export type TranscribeVoiceMessageEventParams = {
  message: ChatMessageModel;
  transcription: string;
};
export type TranscribeVoiceMessageEventCallback = () => void;
export type TranscribeVoiceMessageEventEmitter = (
  params: TranscribeVoiceMessageEventParams,
  callback?: TranscribeVoiceMessageEventCallback
) => void;

export interface SessionClientToServerEvents {
  [MessagesReceivedAckEventName]: MessagesReceivedAckEventEmitter;
  [TranscribeVoiceMessageEventName]: TranscribeVoiceMessageEventEmitter;
}
