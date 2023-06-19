import { ChatMessageModel } from '../models/chatMessage';

export interface SetVoiceMessageTranscription {
  setTranscription: (
    params: SetVoiceMessageTranscription.Params
  ) => Promise<SetVoiceMessageTranscription.Model>;
}

export namespace SetVoiceMessageTranscription {
  // Id of the message
  export type Params = {
    messageId: string;
    transcription: string;
  };

  export type Model = ChatMessageModel;
}
