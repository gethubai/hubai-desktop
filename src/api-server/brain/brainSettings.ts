import type { UniqueId } from 'mo/common/types';

export enum PromptType {
  text = 'text',
  image = 'image',
  audio = 'audio',
}

export interface IBrainSettings {
  id: UniqueId;
  name: string;
  supportedPromptTypes: PromptType[];
}
