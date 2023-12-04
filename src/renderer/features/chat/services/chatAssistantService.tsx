import { ChatModel } from 'api-server/chat/domain/models/chat';
import {
  IChatAssistant,
  IChatAssistantController,
} from '@hubai/core';
import { ChatBrainSettingsForm } from '../workbench/components/chatBrainSettingsForm';
import { IChatWindowService } from './chatWindowService';
import { ChatSessionService } from './chatSessionService';

export class ChatAssistantService {
  private controller?: IChatAssistantController;

  constructor(
    private readonly chatWindowService: IChatWindowService,
    private readonly assistant: IChatAssistant,
    private readonly chat: ChatModel
  ) {}

  init() {
    const { assistant: chatAssistant } = this.chatWindowService.getState();

    if (!chatAssistant) {
      return;
    }

    this.controller = this.assistant.createController?.();

    const getAssistantSettings = () => ({
      ...(this.assistant.getDefaultSettings() ?? {}),
      ...(chatAssistant?.settings ?? {}),
    });

    if (this.assistant.settingsMap && chatAssistant) {
      this.addAuxiliaryBarContent(
        <ChatBrainSettingsForm
          formTitle=""
          settingsMap={this.assistant.settingsMap}
          currentSettings={getAssistantSettings()}
          validator={this.controller?.validateSettings}
          onSubmit={this.onUpdateSettings.bind(this)}
        />
      );
    }

    if (this.controller) {
      const session = new ChatSessionService(
        this.chatWindowService.getSessionServer(),
        this.chatWindowService
      );

      this.controller.init({
        session,
        chat: this.chat,
        getSettings: getAssistantSettings,
        setSettings: (settings: any) => {
          session.changeMemberSettings(chatAssistant.id, settings);
        },
        appendToAuxiliaryBar: this.addAuxiliaryBarContent.bind(this),
      });
    }
  }

  addAuxiliaryBarContent(render: React.ReactNode) {
    this.chatWindowService.addAuxiliaryBarTab(
      {
        key: `assistants.${this.assistant.id}`,
        title: this.assistant.displayName,
      },
      render
    );
  }

  onUpdateSettings(settings: any) {
    const { assistant } = this.chatWindowService.getState();
    if (!assistant) return;

    assistant.settings = settings;

    // The addMember method will update the user if it already exists
    this.chatWindowService.getSessionServer().addMember(assistant);

    this.controller?.onSettingsUpdated?.(settings);
  }

  dispose() {
    try {
      this.controller?.dispose?.();
    } catch (e) {
      console.error('Error disposing assistant', e);
    }
  }
}
