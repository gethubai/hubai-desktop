/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
import { ChatMemberType, ChatModel } from 'api-server/chat/domain/models/chat';
import { ChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import { container } from 'tsyringe';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import { IBrainManagementService } from 'renderer/features/brain/services/brainManagement';
import { Component } from '@hubai/core/esm/react';
import { MessageUpdatedEvent } from 'api-server/chat/chatTcpServer/events/serveSessionEvents';
import { IDisposable } from '@hubai/core/esm/monaco/common';
import { ILocalUserService } from 'renderer/features/user/services/userService';
import { IContactService } from 'renderer/features/contact/models/service';
import { ChatWindowStateModel, IChatWindowState } from '../models/chatWindow';
import { type IChatClient, IChatSessionServer } from '../sdk/contracts';
import { ChatMessageViewModel } from '../workbench/components/chat/types';

export interface IChatWindowService
  extends Component<IChatWindowState>,
    IDisposable {
  setMessages(messages: ChatMessageViewModel[]): void;
  setAuxiliaryBarView(view: boolean): void;

  getSessionServer(): IChatSessionServer;
}

export class ChatWindowService
  extends Component<IChatWindowState>
  implements IChatWindowService
{
  protected state: IChatWindowState;

  private brainService: IBrainManagementService;

  private chatSessionServer!: IChatSessionServer;

  private contactService: IContactService;

  private chatClient: IChatClient;

  private userService: ILocalUserService;

  constructor(private readonly chat: ChatModel) {
    super();
    this.brainService = container.resolve('IBrainManagementService');
    this.userService =
      container.resolve<ILocalUserService>('ILocalUserService');
    this.contactService = container.resolve('IContactService');
    this.state = new ChatWindowStateModel(
      chat.id,
      this.userService.getUser().id,
      [],
      this.brainService.getPackages(),
      chat.members.filter((m) => m.memberType === ChatMemberType.brain),
      undefined,
      !chat.isDirect
    );
    this.chatClient = container.resolve<IChatClient>('IChatClient');
    this.initServer();
  }

  setAuxiliaryBarView(view: boolean): void {
    this.setState({ auxiliaryBarView: { hidden: view } });
  }

  private async initServer(): Promise<void> {
    this.chatSessionServer = this.chatClient.session(this.chat.id);
    this.chatSessionServer.onMessageReceived(this.onMessageReceived.bind(this));
    this.chatSessionServer.onMessageUpdated(this.onMessageUpdated.bind(this));
    this.chatSessionServer.onChatUpdated(this.onChatUpdated.bind(this));

    await this.chatSessionServer.watch();

    const messages = await this.chatSessionServer.messages();
    this.onMessagesLoaded(messages);
  }

  onChatUpdated(chat: ChatModel): void {
    const { members, isDirect } = chat;
    if (isDirect) return;

    this.setState({
      selectedBrains: members.filter(
        (m) => m.memberType === ChatMemberType.brain
      ),
    });
  }

  onMessagesLoaded(ctx: ChatMessagesContext): void {
    this.setState({ users: ctx.users ?? {} });
    this.setMessages(
      ctx.messages?.filter((m) => !m.hidden)?.map(this.mapMessage) ?? []
    );
  }

  onMessageReceived(message: ChatMessageModel): void {
    if (message.hidden) return;
    this.addMessage(message);
  }

  async onMessageUpdated({
    prevMessage,
    message,
  }: MessageUpdatedEvent.Params): Promise<void> {
    this.updateMessage(message);

    // message transcribed
    if (
      message.text &&
      !prevMessage?.text &&
      message.senderId === this.state.userId &&
      message.messageType === 'voice'
    ) {
      // Send a hidden message to the chat with the transcription. This message will be used by the text brain to generate a response.
      await this.chatSessionServer.sendMessage({
        text: message.text,
        hidden: true,
      });
    }
  }

  mapMessage = (message: ChatMessageModel): ChatMessageViewModel => {
    const { users } = this.state;
    const isSelf = message.senderId === this.state.userId;

    const sender = users[message.senderId] ??
      this.contactService.get(message.senderId) ?? {
        name: isSelf ? this.userService.getUser().name : 'Unknown',
      };

    return {
      id: message.id,
      textContent: message.text?.body,
      voiceContent: message.voice
        ? {
            audioSrc: message.voice?.file,
            mimeType: message.voice.mimeType,
          }
        : undefined,
      messageContentType: message.messageType,
      sentAt: message.sendDate,
      senderDisplayName: sender.name,
      messageType: isSelf ? 'request' : 'response',
      status: message.status,
      avatarSrc: sender.avatar,
      avatarIcon: isSelf ? 'account' : 'octoface',
    };
  };

  setMessages(messages: ChatMessageViewModel[]): void {
    this.setState({ messages: messages || [] });
  }

  addMessage(message: ChatMessageModel) {
    const { messages } = this.state;
    // check if message already exists
    const index = messages.findIndex((m) => m.id === message.id);
    if (index === -1) {
      messages.push(this.mapMessage(message));
    }
    this.setMessages(messages);
  }

  updateMessage(message: ChatMessageModel) {
    const { messages } = this.state;

    const index = messages.findIndex((m) => m.id === message.id);
    if (index !== -1) {
      messages[index] = this.mapMessage(message);
    }
    this.setMessages(messages);
  }

  getSessionServer() {
    return this.chatSessionServer;
  }

  dispose(): void {
    this.state = null;
    this.chatSessionServer.dispose();
    this.chatSessionServer = null;
  }
}
