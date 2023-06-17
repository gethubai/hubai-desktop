export enum PromptType {
  text = 'text',
  image = 'image',
  audio = 'audio',
}

export interface IBrainSettings {
  id: string;
  name: string;
  supportedPromptTypes: PromptType[];
}
