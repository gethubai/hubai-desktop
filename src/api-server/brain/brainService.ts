/* eslint-disable no-empty-function */
export class BrainSettingsValidationResult {
  errors: string[];

  get success(): boolean {
    return !this.errors || this.errors.length === 0;
  }

  constructor() {
    this.errors = [];
  }

  addFieldError(
    fieldName: string,
    error: string
  ): BrainSettingsValidationResult {
    this.addError(`${fieldName}: ${error}`);
    return this;
  }

  addError(error: string): BrainSettingsValidationResult {
    this.errors.push(error);
    return this;
  }

  getMessage() {
    return `You must correctly set the following settings before using this brain: \n ${this.errors.join(
      '\n'
    )}`;
  }

  static createError(error: string): BrainSettingsValidationResult {
    const result = new BrainSettingsValidationResult();
    return result.addError(error);
  }
}

export type BrainPromptResponse = {
  result: string;
  validationResult: BrainSettingsValidationResult;
};

export interface IBrainPromptContext<TPromptSettings> {
  // message id
  id: string;
  chatId: string;
  senderId: string;
  settings?: TPromptSettings;
  [key: string]: any;
}

export interface IBrainService {}

export interface TextBrainPrompt {
  role: string | undefined;
  message: string;
}

export interface ITextBrainService<TSettings> extends IBrainService {
  sendTextPrompt(
    prompts: TextBrainPrompt[],
    context: IBrainPromptContext<TSettings>
  ): Promise<BrainPromptResponse>;
}

export type LocalAudioPrompt = {
  audioFilePath: string;
  language: string;
};

export interface IAudioTranscriberBrainService<TSettings>
  extends IBrainService {
  transcribeAudio(
    audioPath: LocalAudioPrompt,
    context: IBrainPromptContext<TSettings>
  ): Promise<BrainPromptResponse>;
}
