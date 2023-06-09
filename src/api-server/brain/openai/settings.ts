import { UniqueId } from 'mo/common/types';
import { IBrainSettings, PromptType } from '../brainSettings';

export default class OpenAiBrainSettings implements IBrainSettings {
  id: UniqueId;

  name: string;

  supportedPromptTypes: PromptType[];

  apiKey: string;

  textModel: string;

  audioTranscriberModel: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.id = 'internal__openai';
    this.name = 'OpenAI';
    this.supportedPromptTypes = [PromptType.text, PromptType.audio];
    this.textModel = 'gpt-3.5-turbo';
    this.audioTranscriberModel = 'whisper-1';
  }
}
