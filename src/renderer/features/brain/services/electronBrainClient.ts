import {
  BrainCapability,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { BrainPromptResponse } from '@hubai/brain-sdk';
import {
  BrainResponse,
  IAudioTranscriptionBrainCapability,
  IBrainClient,
  IImageGenerationBrainCapability,
  ITextBrainCapability,
  LocalBrain,
} from '@hubai/core';

export class ElectronBrainClient implements IBrainClient {
  brain: LocalBrain;

  conversation?: ITextBrainCapability;

  voiceTranscription?: IAudioTranscriptionBrainCapability;

  imageGeneration?: IImageGenerationBrainCapability;

  constructor(brain: LocalBrainModel) {
    this.brain = brain;

    if (brain.capabilities.includes(BrainCapability.CONVERSATION))
      this.conversation = {
        sendTextPrompt: async (prompts, options) => {
          const result = window.electron.brain.sendTextPrompt(
            brain.id,
            prompts.map((p) => ({
              role: p.role,
              sentAt: p.sentAt,
              message: p.value,
              attachments: p.attachments,
            })),
            options?.settings
          );

          return {
            result: result.result,
            errors: result.validationResult?.errors,
            attachments: result.attachments,
          };
        },
      };

    if (brain.capabilities.includes(BrainCapability.VOICE_TRANSCRIPTION)) {
      this.voiceTranscription = {
        transcribeAudio: async (prompt, options) => {
          const result = window.electron.brain.transcribeAudio(
            brain.id,
            {
              audioFilePath: prompt.audioFilePath,
              language: prompt.language,
            },
            options?.settings
          );

          return this.parseBrainResponse(result);
        },
      };
    }

    if (brain.capabilities.includes(BrainCapability.IMAGE_GENERATION)) {
      this.imageGeneration = {
        generateImage: async (prompts, options) => {
          const result = window.electron.brain.generateImage(
            brain.id,
            prompts.map(
              (p) => ({
                role: p.role,
                sentAt: p.sentAt,
                message: p.value,
                attachments: p.attachments,
                expectedResponseType: p.expectedResponseType,
              }),
              options?.settings
            )
          );
          return this.parseBrainResponse(result);
        },
      };
    }
  }

  parseBrainResponse(response: BrainPromptResponse): BrainResponse {
    return {
      result: response.result,
      errors: response.validationResult?.errors ?? [],
      attachments: response.attachments,
    };
  }
}
