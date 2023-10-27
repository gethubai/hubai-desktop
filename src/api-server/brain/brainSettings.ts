import { BrainCapability } from './domain/models/localBrain';

export enum PromptType {
  text = 'text',
  image = 'image',
  audio = 'audio',
}

export interface IBrainSettings {
  id: string;
  name: string;
  /* The name that will appear for user */
  displayName: string;
  supportedPromptTypes: PromptType[];
}

export const getSupportedPromptTypesFromCapabilities = (
  capabilities: BrainCapability[]
) => {
  const supportedPromptTypes: PromptType[] = capabilities.map((capability) => {
    if (
      capability === BrainCapability.CONVERSATION ||
      capability === BrainCapability.IMAGE_GENERATION
    ) {
      return PromptType.text;
    }

    if (capability === BrainCapability.IMAGE_RECOGNITION) {
      return PromptType.image;
    }

    if (capability === BrainCapability.VOICE_TRANSCRIPTION) {
      return PromptType.audio;
    }

    return null;
  });

  return supportedPromptTypes;
};
