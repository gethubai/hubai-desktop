import React from 'react';
import {
  BrainCapability,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { Controller } from '@hubai/core';
import { IDisposable } from '@hubai/core/esm/monaco/common';
import { IChatItem } from '../models/chat';

export interface IChatController extends Partial<Controller> {
  onChatClick?: (item: IChatItem) => void;
}

export interface IChatWindowController
  extends Partial<Controller>,
    IDisposable {
  onSendTextMessage?: (message: string) => void;
  onSendVoiceMessage?: (audioBlob: Blob) => void;
  onCapabilityBrainChanged?: (
    brain: LocalBrainModel,
    capability: BrainCapability
  ) => void;
  getBrainChatSettings(brain: LocalBrainModel): any;
  AuxiliaryBarTabs: React.ComponentType;
  AuxiliaryBar: React.ComponentType;
}

export interface IChatListController extends Partial<Controller> {
  onChatClick?: (item: IChatItem) => void;
}
