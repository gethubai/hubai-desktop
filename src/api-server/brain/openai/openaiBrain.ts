/* eslint-disable max-classes-per-file */
import type {
  BrainPromptResponse,
  IBrainService,
  ITextBrainService,
  TextBrainPrompt,
} from '../brainService';
import { type IBrainSettings } from '../brainSettings';
import OpenAiBrainSettings from './settings';

const openAiSdk = require('@tectalic/openai').default;

export default class OpenAiBrainService
  implements IBrainService, ITextBrainService
{
  // eslint-disable-next-line no-useless-constructor
  constructor(private settings: OpenAiBrainSettings) {
    // super(settings);
  }

  getSettings(): IBrainSettings {
    return this.settings;
  }

  sendTextPrompt(prompts: TextBrainPrompt[]): Promise<BrainPromptResponse> {
    return new Promise((resolve, reject) => {
      openAiSdk(this.settings.apiKey)
        .chatCompletions.create({
          model: 'gpt-3.5-turbo',
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
