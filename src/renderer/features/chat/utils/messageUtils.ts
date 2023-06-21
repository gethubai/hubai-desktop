import { BrainCapability } from 'api-server/brain/domain/models/localBrain';

export const getTextMessageTypeForBrainCapability = (
  brainCapability: BrainCapability
) => {
  if (brainCapability === BrainCapability.CONVERSATION) return 'text';

  if (brainCapability === BrainCapability.IMAGE_RECOGNITION) return 'image';

  if (brainCapability === BrainCapability.VOICE_TRANSCRIPTION) return 'voice';

  return 'text';
};
