import {
  IAuxiliaryData,
  IBrainClient,
  IBrainClientManager,
  ChatMember,
  ChatMemberSetting,
  ChatMessage,
  IChatSessionService,
  SendChatMessageOptions,
} from '@hubai/core';
import { ISubMenuProps } from '@hubai/core/esm/components';
import { container } from 'tsyringe';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import React from 'react';
import { MessageUpdatedEventParams } from 'api-server/chat/chatTcpServer/events/serveSessionEvents';
import { IChatWindowService } from './chatWindowService';
import { IChatSessionServer, SendMessage } from '../sdk/contracts';

export class ChatSessionService implements IChatSessionService {
  private readonly brainClientManager: IBrainClientManager;

  constructor(
    private readonly sessionServer: IChatSessionServer,
    private readonly chatWindowService: IChatWindowService
  ) {
    this.brainClientManager = container.resolve<IBrainClientManager>(
      'IBrainClientManager'
    );
  }

  changeMemberSettings(memberId: string, settings: ChatMemberSetting): void {
    const member = this.getMembers().find((m) => m.id === memberId);

    if (!member) {
      console.error(`Member with id ${memberId} not found on chat`);
      return;
    }

    this.chatWindowService.updateMemberSettings(member as any, settings);
  }

  getMembers(): ChatMember[] {
    const { selectedBrains, assistant } = this.chatWindowService.getState();

    const members = [...selectedBrains];

    if (assistant) {
      members.push(assistant);
    }

    return members;
  }

  async sendMessage(options: SendChatMessageOptions): Promise<boolean> {
    try {
      const sendMessageOptions: SendMessage = {
        hidden: options.hidden,
        isSystemMessage: options.isSystemMessage,
      };

      if (options.text) {
        sendMessageOptions.text = {
          body: options.text,
        };
      }

      if (options.attachments) {
        sendMessageOptions.attachments = options.attachments;
      }

      if (options.audio) {
        const audio = await this.sessionServer.sendAudio({
          data: options.audio,
          mimeType: options.audio.type,
        });

        sendMessageOptions.voice = {
          file: audio.file,
          mimeType: audio.mimeType,
        };
      }

      await this.sessionServer.sendMessage(sendMessageOptions);
      return true;
    } catch (e) {
      console.error(
        'An exception ocurred while trying to send the message:',
        options,
        e
      );
      return false;
    }
  }

  getBrains(): IBrainClient[] {
    const { selectedBrains } = this.chatWindowService.getState();

    if (selectedBrains.length > 0) {
      return this.brainClientManager
        .getAvailableClients()
        .filter((c) => selectedBrains.map((m) => m.id).includes(c.brain.id));
    }

    return [];
  }

  async messages(): Promise<ChatMessage[]> {
    const messages = await this.sessionServer.messages();

    return messages.messages.map(this.mapModelToChatMessage);
  }

  onMessageReceived(callback: (message: ChatMessage) => void): void {
    this.sessionServer.onMessageReceived((message) => {
      callback(this.mapModelToChatMessage(message));
    });
  }

  onMessageUpdated(callback: (message: ChatMessage) => void): void {
    this.sessionServer.onMessageUpdated((message) => {
      callback(this.mapUpdatedMessageToChatMessage(message));
    });
  }

  addAuxiliaryBar(
    auxiliaryBar: IAuxiliaryData,
    component: React.ReactNode
  ): void {
    this.chatWindowService.addAuxiliaryBarTab(auxiliaryBar, component);
  }

  addPlusButtonAction(action: ISubMenuProps): void {
    if (action) {
      // workaround for linting
      /* empty */
    }
    throw new Error('Method not implemented.');
  }

  mapModelToChatMessage(message: ChatMessageModel): ChatMessage {
    return {
      id: message.id,
      senderId: message.senderId,
      recipients: message.recipients.map((r) => r.id),
      sendDate: message.sendDate,
      text: message.text?.body,
      audio: message.voice?.file,
      attachments: message.attachments,
      hidden: message.hidden,
      isSystemMessage: message.messageType === 'system',
    };
  }

  mapUpdatedMessageToChatMessage(
    messageUpdated: MessageUpdatedEventParams
  ): ChatMessage {
    const { message } = messageUpdated;
    return {
      id: message.id,
      senderId: message.senderId,
      recipients: message.recipients.map((r) => r.id),
      sendDate: message.sendDate,
      text: message.text?.body,
      audio: message.voice?.file,
      attachments: message.attachments,
      hidden: message.hidden,
      isSystemMessage: message.messageType === 'system',
    };
  }
}
