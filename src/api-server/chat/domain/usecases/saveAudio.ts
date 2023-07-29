import { RawVoiceMessage, VoiceMessage } from '../models/chatMessage';

export interface SaveAudioChat {
  saveFile: (params: SaveAudioChat.Params) => Promise<SaveAudioChat.Model>;
}

export namespace SaveAudioChat {
  export type Params = RawVoiceMessage;

  export type Model = VoiceMessage;
}
