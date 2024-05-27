import {
  BrainCapability,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { Controller } from '@hubai/core';
import { IDisposable } from '@hubai/core/esm/monaco/common';
import { ISubMenuProps } from '@hubai/core/esm/components';
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
  attachFile(file: FileList): void;
  removeAttachedFile(fileId: string): void;
}

export interface IChatListController extends Partial<Controller> {
  onChatClick?: (item: IChatItem) => void;
  onContextMenuClick?: (menuId: string, item: IChatItem) => void;
  getCreateChatMenuItems(): ISubMenuProps[];
}
