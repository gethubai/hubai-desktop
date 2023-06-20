import { Controller } from 'mo/react/controller';
import {
  BrainCapability,
  BrainModel,
} from 'api-server/brain/domain/models/brain';
import { IChatItem } from '../models/chat';

export interface IChatController extends Partial<Controller> {
  onChatClick?: (item: IChatItem) => void;
}

export interface IChatWindowController extends Partial<Controller> {
  onSendTextMessage?: (message: string) => void;
  onSendVoiceMessage?: (audioBlob: Blob) => void;
  onCapabilityBrainChanged?: (
    brain: BrainModel,
    capability: BrainCapability
  ) => void;
}
