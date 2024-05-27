import { ChatMessageModel } from '../models/chatMessage';

// Id of the message
export type SetVoiceMessageTranscriptionParams = {
  messageId: string;
  transcription: string;
};

export type SetVoiceMessageTranscriptionModel = ChatMessageModel;

export interface SetVoiceMessageTranscription {
  setTranscription: (
    params: SetVoiceMessageTranscriptionParams
  ) => Promise<SetVoiceMessageTranscriptionModel>;
}
