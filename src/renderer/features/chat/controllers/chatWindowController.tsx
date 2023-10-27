/* eslint-disable promise/catch-or-return */
import { Controller, connect } from '@hubai/core/esm/react';
import {
  ChatMemberType,
  ChatModel,
  ChatUser,
} from 'api-server/chat/domain/models/chat';
import {
  IRecipientSettings,
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
import { IDisposable } from '@hubai/core/esm/monaco/common';
import { Uri, editor as monaco } from '@hubai/core/esm/monaco';
import { openFileSelector } from 'renderer/common/fileUtils';
import { IChatWindowController } from './type';
import { IChatWindowService } from '../services/chatWindowService';
import { getTextMessageTypeForBrainCapability } from '../utils/messageUtils';
import ChatAuxiliaryBarService from '../services/chatAuxiliaryBarService';
import { ChatAuxiliaryBarController } from './chatAuxiliaryBarController';
import { ChatBrainSettings } from '../workbench/chatBrainSettings';

export default class ChatWindowController
  extends Controller
  implements IChatWindowController, IDisposable
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

    this.chatWindowService.setState({
      plusButtonActions: [
        {
          id: 'media',
          name: 'Photos & Videos',
          icon: 'device-camera',
          onClick: () => this.openFileSelectorDialog('image/*,video/*'),
        },
        {
          id: 'document',
          name: 'Documents',
          icon: 'file',
          onClick: () => this.openFileSelectorDialog('application/pdf'),
        },
      ],
    });
  }

  public openFileSelectorDialog = (fileType: string) => {
    openFileSelector((file) => {
      this.chatWindowService.attachFile(file);
    }, fileType);
  };

  public removeAttachedFile = (fileId: string) => {
    this.chatWindowService.removeAttachedFile(fileId);
  };

  public onSendTextMessage = (message: string) => {
    const model = this.createMessageToSend();
    model.setText({ body: message });

    const { files } = this.chatWindowService.getState();

    const sessionServer = this.chatWindowService.getSessionServer();

    sessionServer
      .sendMessage({
        text: { body: message },
        attachments: files?.map((f) => f.file),
        brainsSettings: model.recipientSettings,
      })
      .finally(() => this.chatWindowService.setState({ files: [] }));
  };

  public onSendVoiceMessage = async (audioBlob: Blob) => {
    const model = this.createMessageToSend();
    const sessionServer = this.chatWindowService.getSessionServer();

    const voiceFile = await sessionServer.sendAudio({
      data: audioBlob,
      mimeType: 'audio/wav',
    });

    model.setVoice(voiceFile);
    sessionServer
      .sendMessage(model)
      .finally(() => this.chatWindowService.setState({ files: [] }));
  };

  public onCapabilityBrainChanged = (
    brain: LocalBrainModel,
    capability: BrainCapability
  ) => {
    const { selectedBrains } = this.chatWindowService.getState();
    const chatMessageType = getTextMessageTypeForBrainCapability(capability);
    const chatMember = {
      id: brain.id,
      memberType: ChatMemberType.brain,
      handleMessageTypes: [chatMessageType],
    } as ChatUser;

    const newSelectedBrains = [...selectedBrains];
    const currentBrain = newSelectedBrains.find((b) => b.id === brain.id);
    const brainWithSelectedCapability = selectedBrains.find((b) =>
      b.handleMessageTypes?.includes(chatMessageType)
    );

    if (brainWithSelectedCapability) {
      brainWithSelectedCapability.handleMessageTypes =
        brainWithSelectedCapability.handleMessageTypes?.filter(
          (b) => b !== chatMessageType
        );

      if (brainWithSelectedCapability.handleMessageTypes?.length === 0) {
        // remove brain from chat if it doesn't have any capabilities selected
        this.chatWindowService
          .getSessionServer()
          .removeMember(brainWithSelectedCapability.id);
      } else {
        // Update brain with new capabilities
        this.chatWindowService
          .getSessionServer()
          .addMember(brainWithSelectedCapability);
      }
    }

    currentBrain?.handleMessageTypes?.push(chatMessageType);

    this.chatWindowService
      .getSessionServer()
      .addMember(currentBrain || chatMember);
  };

  private createMessageToSend(): SendChatMessageModel {
    const sender = this.getSender();
    const model = new SendChatMessageModel(this.chat.id, sender.id);

    model.setRecipientSettings(this.getRecipientSettingsForMessage(model));

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

    chatBrain.settings = chatBrainSettings;

    this.chatWindowService.getSessionServer().addMember(chatBrain);
  };

  public getChat = () => {
    return this.chat;
  };

  public getRecipientSettingsForMessage = (
    message: SendChatMessageModel
  ): IRecipientSettings => {
    const settings: IRecipientSettings = {};
    // settings[message.to] = this.getBrainChatSettingsById(message.to);

    // TODO: Refactor this
    return settings;
  };

  public getBrainChatSettings = (brain: LocalBrainModel) => {
    return this.getBrainChatSettingsById(brain.id);
  };

  private getBrainChatSettingsById = (brainId: string) => {
    const brainSettings = this.brainService.getPackageSettings(brainId);
    const chatBrain = this.chatWindowService
      .getState()
      .selectedBrains.find((b) => b.id === brainId);

    if (!chatBrain) {
      return undefined;
    }

    const mergedSettings = { ...brainSettings, ...chatBrain?.settings };

    return mergedSettings;
  };

  dispose(): void {
    const monacoEditor = monaco.getModel(
      Uri.parse(`inmemory://model/${this.chat.id}`)
    );

    // Dispose the monacoEditor instance when the chat window is closed (this is the text input)
    if (monacoEditor && !monacoEditor.isDisposed()) {
      monacoEditor.dispose();
    }
  }
}
