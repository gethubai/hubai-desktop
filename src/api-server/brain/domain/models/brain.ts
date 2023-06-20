export enum BrainCapability {
  CONVERSATION = 'conversation',
  VOICE_TRANSCRIPTION = 'voice_transcription',
  IMAGE_RECOGNITION = 'image_recognition',
}

export type BrainModel = {
  id: string;
  name: string;
  capabilities: BrainCapability[];
  createdDate: Date | string;
};
