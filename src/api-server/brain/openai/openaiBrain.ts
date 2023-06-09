/* eslint-disable max-classes-per-file */
import type {
  BrainPromptResponse,
  IBrainService,
  ILocalAudioTranscriberBrainService,
  ITextBrainService,
  LocalAudioPrompt,
  TextBrainPrompt,
} from '../brainService';
import { type IBrainSettings } from '../brainSettings';
import OpenAiBrainSettings from './settings';

const openAiSdk = require('@tectalic/openai').default;

export default class OpenAiBrainService
  implements
    IBrainService,
    ITextBrainService,
    ILocalAudioTranscriberBrainService
{
  // eslint-disable-next-line no-useless-constructor
  constructor(private settings: OpenAiBrainSettings) {
    // super(settings);
  }

  async transcribeAudio(
    prompt: LocalAudioPrompt
  ): Promise<BrainPromptResponse> {
    const result = await openAiSdk(
      this.settings.apiKey
    ).audioTranscriptions.create({
      file: prompt.audioFilePath,
      language: prompt.language,
      model: this.settings.audioTranscriberModel,
    });

    return { result: result.data.text };
  }

  getSettings(): IBrainSettings {
    return this.settings;
  }

  sendTextPrompt(prompts: TextBrainPrompt[]): Promise<BrainPromptResponse> {
    return new Promise((resolve, reject) => {
      openAiSdk(this.settings.apiKey)
        .chatCompletions.create({
          model: this.settings.textModel,
          messages: prompts.map((m) => ({ role: m.role, content: m.message })),
        })
        .then((response) => {
          return resolve({
            result: response.data.choices[0].message.content.trim(),
          });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}
