import { container } from 'tsyringe';
import {
  BrainCapability,
  BrainModel,
} from 'api-server/brain/domain/models/brain';
import { ChatStateModel, IChatState } from './features/chat/models/chat';
import { BrainStateModel, IBrainState } from './features/brain/models/brain';

container.register<IChatState>(ChatStateModel, {
  useValue: new ChatStateModel(),
});

const mockBrains: BrainModel[] = [
  {
    id: 'brainIdTest',
    name: 'OpenAI',
    createdDate: new Date(),
    capabilities: [
      BrainCapability.CONVERSATION,
      BrainCapability.VOICE_TRANSCRIPTION,
    ],
  },
  {
    id: 'ChatGpt35',
    name: 'ChatGPT 3.5',
    createdDate: new Date(),
    capabilities: [BrainCapability.CONVERSATION],
  },
  {
    id: 'whisper',
    name: 'Whisper Speech Recognition',
    createdDate: new Date(),
    capabilities: [BrainCapability.VOICE_TRANSCRIPTION],
  },
  {
    id: 'fakeBrainId',
    name: 'Test Brain',
    createdDate: new Date(),
    capabilities: [
      BrainCapability.CONVERSATION,
      BrainCapability.VOICE_TRANSCRIPTION,
    ],
  },
];

container.register<IBrainState>(BrainStateModel, {
  useValue: new BrainStateModel(mockBrains),
});
