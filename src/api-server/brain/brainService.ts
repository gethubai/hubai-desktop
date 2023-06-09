import type { IBrainSettings } from './brainSettings';

export type BrainPromptResponse = {
  result: string;
};

export interface IBrainService {
  getSettings(): IBrainSettings;
}

export type TextBrainPrompt = {
  role: string | undefined;
  message: string;
};

export interface ITextBrainService extends IBrainService {
  sendTextPrompt(prompts: TextBrainPrompt[]): Promise<BrainPromptResponse>;
}

export type LocalAudioPrompt = {
  audioFilePath: string;
  language: string;
};

export interface ILocalAudioTranscriberBrainService extends IBrainService {
  transcribeAudio(audioPath: LocalAudioPrompt): Promise<BrainPromptResponse>;
}
