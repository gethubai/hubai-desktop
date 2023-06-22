/* eslint-disable no-empty-function */
import type { IBrainSettings } from './brainSettings';

export type BrainPromptResponse = {
  result: string;
};

export class SetUserSettingsResult {
  errors: string[];

  get success(): boolean {
    return !this.errors || this.errors.length === 0;
  }

  constructor() {
    this.errors = [];
  }

  addFieldError(fieldName: string, error: string): SetUserSettingsResult {
    this.addError(`${fieldName}: ${error}`);
    return this;
  }

  addError(error: string): SetUserSettingsResult {
    this.errors.push(error);
    return this;
  }

  static createError(error: string): SetUserSettingsResult {
    const result = new SetUserSettingsResult();
    return result.addError(error);
  }
}

export interface IBrainService {
  getSettings(): IBrainSettings;
  setUserSettings(settings: any): SetUserSettingsResult;
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

export interface IAudioTranscriberBrainService extends IBrainService {
  transcribeAudio(audioPath: LocalAudioPrompt): Promise<BrainPromptResponse>;
}
