import { Controller, connect } from '@hubai/core/esm/react';
import { ChatBrain, ChatModel } from 'api-server/chat/domain/models/chat';
import {
  ChatMessageType,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import {
  BrainCapability,
  BrainSettingScope,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { type ILocalUserService } from 'renderer/features/user/services/userService';
import { container } from 'tsyringe';
import { type IBrainManagementService } from 'renderer/features/brain/services/brainManagement';
import React from 'react';
import AuxiliaryBarTab from 'mo/workbench/auxiliaryBar/auxiliaryBarTab';
import AuxiliaryBar from 'mo/workbench/auxiliaryBar/auxiliaryBar';
import { IChatWindowController } from './type';
import { IChatWindowService } from '../services/chatWindowService';
import { getTextMessageTypeForBrainCapability } from '../utils/messageUtils';
import ChatAuxiliaryBarService from '../services/chatAuxiliaryBarService';
import { ChatAuxiliaryBarController } from './chatAuxiliaryBarController';
import { ChatBrainSettings } from '../workbench/chatBrainSettings';

function blobToByteArray(blob: Blob): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const byteArray = new Uint8Array(arrayBuffer);
      resolve(byteArray);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsArrayBuffer(blob);
  });
}

export default class ChatWindowController
  extends Controller
  implements IChatWindowController
{
  private brainService: IBrainManagementService;

  private chatAuxiliaryBarService!: ChatAuxiliaryBarService;

  AuxiliaryBarTabs!: React.ComponentType;

  AuxiliaryBar!: React.ComponentType;

  constructor(
    private readonly chatWindowService: IChatWindowService,
    private readonly chat: ChatModel,
    private readonly localUserService: ILocalUserService
  ) {
    super();
    this.brainService = container.resolve<IBrainManagementService>(
      'IBrainManagementService'
    );
  }

  public initView(): void {
    this.chatAuxiliaryBarService = new ChatAuxiliaryBarService();
    // TODO: Refactor this to allow extensions to add their own tabs
    const controller = new ChatAuxiliaryBarController(
      this.chatAuxiliaryBarService
    );

    this.AuxiliaryBar = connect(this.chatAuxiliaryBarService, AuxiliaryBar);

    this.AuxiliaryBarTabs = connect(
      this.chatAuxiliaryBarService,
      AuxiliaryBarTab,
      controller
    );

    this.chatAuxiliaryBarService.setMode('tabs');
    this.chatAuxiliaryBarService.addAuxiliaryBar([
      {
        key: 'chat-brain-settings',
        title: 'Brains Settings',
      },
    ]);

    this.chatAuxiliaryBarService.onTabClick(() => {
      const tab = this.chatAuxiliaryBarService.getCurrentTab();

      const ChatBrainSettingsView = connect(
        this.chatWindowService,
        ChatBrainSettings
      );

      if (tab) {
        this.chatAuxiliaryBarService.setChildren(
          <ChatBrainSettingsView
            getBrainChatSettings={this.getBrainChatSettings}
            onSettingChanged={this.onBrainChatSettingChanged}
          />
        );
      }

      this.chatWindowService.setAuxiliaryBarView(!tab);
    });
  }

  public onSendTextMessage = (message: string) => {
    const model = this.createMessageToSend('text');

    model.setText({ body: message });

    this.chatWindowService.sendMessage(model);
  };

  public onSendVoiceMessage = (audioBlob: Blob) => {
    blobToByteArray(audioBlob)
      .then((data: Uint8Array) => {
        const model = this.createMessageToSend('voice');

        model.setVoice({ data, mimeType: 'audio/wav' });

        this.chatWindowService.sendMessage(model);
      })
      .catch((err: any) => {
        console.error('@@@@ AUDIO ERROR:', err);
      });
  };

  public onCapabilityBrainChanged = (
    brain: LocalBrainModel,
    capability: BrainCapability
  ) => {
    const { selectedBrains } = this.chatWindowService.getState();
    const chatMessageType = getTextMessageTypeForBrainCapability(capability);
    const chatBrain = {
      id: brain.id,
      handleMessageType: chatMessageType,
    } as ChatBrain;

    const newSelectedBrains = [...selectedBrains];
    const brainIndex = newSelectedBrains.findIndex(
      (b) => b.handleMessageType === chatMessageType
    );

    if (brainIndex === -1) {
      newSelectedBrains.push(chatBrain);
    } else {
      newSelectedBrains[brainIndex] = chatBrain;
    }

    this.chatWindowService.updateChatBrains(newSelectedBrains);
  };

  private createMessageToSend(
    messageType: ChatMessageType
  ): SendChatMessageModel {
    const sender = this.getSender();
    const brain = this.getBrain(messageType);

    const model = new SendChatMessageModel(
      this.chat.id,
      sender.name,
      sender.id,
      'user',
      brain.id
    );

    return model;
  }

  private getSender() {
    const user = this.localUserService.getUser();
    return { name: user.name, id: user.id };
  }

  public onBrainChatSettingChanged = (
    brain: LocalBrainModel,
    settings: any
  ) => {
    const { selectedBrains } = this.chatWindowService.getState();

    const chatBrain = selectedBrains.find((cb) => cb.id === brain.id);

    if (!chatBrain) {
      console.error('No chat brain found for brain', brain);
      return;
    }

    const chatBrainSettings: any = {};

    brain.settingsMap?.forEach((setting) => {
      if (setting.scope === BrainSettingScope.CHAT_OVERRIDABLE)
        chatBrainSettings[setting.name] = settings[setting.name];
    });

    chatBrain.scopedSettings = chatBrainSettings;

    this.chatWindowService.updateChatBrains(selectedBrains);
  };

  private getBrain(messageType: ChatMessageType): ChatBrain {
    const brainChat = this.chatWindowService
      .getState()
      .selectedBrains.find((brain) => brain.handleMessageType === messageType);

    if (!brainChat)
      throw new Error(`No brain found for message type ${messageType}`);

    return brainChat;
  }

  public getChat = () => {
    return this.chat;
  };

  public getBrainChatSettings = (brain: LocalBrainModel) => {
    const brainSettings = this.brainService.getBrainSettings(brain.name);
    const chatBrain = this.chatWindowService
      .getState()
      .selectedBrains.find((b) => b.id === brain.id);

    const mergedSettings = { ...brainSettings, ...chatBrain?.scopedSettings };

    return mergedSettings;
  };
}
