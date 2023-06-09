import type { IBrainSettings } from './brainSettings';

export type TextBrainPrompt = {
  role: string | undefined;
  message: string;
};

export type BrainPromptResponse = {
  result: string;
};

export interface IBrainService {
  getSettings(): IBrainSettings;
}

export interface ITextBrainService extends IBrainService {
  sendTextPrompt(prompts: TextBrainPrompt[]): Promise<BrainPromptResponse>;
}
