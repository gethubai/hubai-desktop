/* eslint-disable promise/catch-or-return */
import { Controller, connect } from '@hubai/core/esm/react';
import { container } from 'tsyringe';
import { IDisposable } from '@hubai/core/esm/monaco/common';
import { Uri, editor as monaco } from '@hubai/core/esm/monaco';
import { IChatAssistantsManagement } from '@hubai/core';
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
import { type IBrainManagementService } from 'renderer/features/brain/services/brainManagement';
import { openFileSelector } from 'renderer/common/fileUtils';
import { IChatWindowController } from './type';
import { IChatWindowService } from '../services/chatWindowService';
import { getTextMessageTypeForBrainCapability } from '../utils/messageUtils';
import { ChatBrainSettings } from '../workbench/chatBrainSettings';
import { ChatAssistantService } from '../services/chatAssistantService';

export default class ChatWindowController
  extends Controller
  implements IChatWindowController, IDisposable
{
  private brainService: IBrainManagementService;
  private readonly chatAssistantsManagement: IChatAssistantsManagement;

  public assistantService?: ChatAssistantService;

  constructor(
    private readonly chatWindowService: IChatWindowService,
    private readonly chat: ChatModel,
    private readonly localUserService: ILocalUserService
  ) {
    super();
    this.brainService = container.resolve<IBrainManagementService>(
      'IBrainManagementService'
    );

    this.chatAssistantsManagement =
      container.resolve<IChatAssistantsManagement>('IChatAssistantsManagement');
  }

  public initView(): void {
    const ChatBrainSettingsView = connect(
      this.chatWindowService,
      ChatBrainSettings
    );

    this.chatWindowService.addAuxiliaryBarTab(
      {
        key: 'chat-brain-settings',
        title: 'Brains Settings',
      },
      <ChatBrainSettingsView
        getBrainChatSettings={this.getBrainChatSettings}
        onSettingChanged={this.onBrainChatSettingChanged}
      />
    );

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

    this.initAssistant();
  }

  public initAssistant = () => {
    const { assistant: chatAssistant } = this.chatWindowService.getState();

    if (!chatAssistant) {
      return;
    }

    const assistant = this.chatAssistantsManagement
      .getAssistants()
      .find((a) => a.id === chatAssistant.id);

    if (assistant) {
      try {
        this.assistantService = new ChatAssistantService(
          this.chatWindowService,
          assistant,
          this.chat
        );

        this.assistantService.init();
      } catch (e) {
        console.error(`Could not init assistant: ${assistant.displayName} `, e);
        this.chatWindowService.setState({ assistant: undefined });
      }
    }
  };

  public openFileSelectorDialog = (fileType: string) => {
    openFileSelector((file) => {
      this.chatWindowService.attachFile(file);
    }, fileType);
  };

  public attachFile = (files: FileList): void => {
    for (const file of files) {
      this.chatWindowService.attachFile(file);
    }
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
        //        brainsSettings: model.recipientSettings,
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

    this.assistantService?.dispose?.();
  }
}
