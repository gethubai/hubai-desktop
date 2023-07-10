import {
  BrainCapability,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { Controller } from '@hubai/core';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import { IChatItem } from '../models/chat';

export interface IChatController extends Partial<Controller> {
  onChatClick?: (item: IChatItem) => void;
}

export interface IChatWindowController extends Partial<Controller> {
  onSendTextMessage?: (message: string) => void;
  onSendVoiceMessage?: (audioBlob: Blob) => void;
  onCapabilityBrainChanged?: (
    brain: LocalBrainModel,
    capability: BrainCapability
  ) => void;
  getChat(): ChatModel;
}
