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
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { prettifyFileSize } from 'renderer/common/fileUtils';
import { ChatWindowStateModel, IChatWindowState } from '../models/chatWindow';
import { type IChatClient, IChatSessionServer } from '../sdk/contracts';
import { ChatMessageViewModel } from '../workbench/components/chat/types';

export interface IChatWindowService
  extends Component<IChatWindowState>,
    IDisposable {
  setMessages(messages: ChatMessageViewModel[]): void;
  setAuxiliaryBarView(view: boolean): void;

  getSessionServer(): IChatSessionServer;

  attachFile(file: File): void;
  removeAttachedFile(fileId: string): void;
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
      attachments: message.attachments?.map((a) => ({
        id: a.id,
        fileSrc: a.file,
        attachmentType: a.attachmentType,
        name: a.originalFileName,
        size: prettifyFileSize(a.size),
        mimeType: a.mimeType,
      })),
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

  attachFile(file: File): void {
    const { files } = this.state;

    let previewUrl = '';

    if (file.type.startsWith('image')) {
      previewUrl = URL.createObjectURL(file);
    } else {
      previewUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAxlBMVEW8wsa8wsaYp6istrmZnqG9w8eYp6iUpKVHcEyVpaa2vsGVpaaUpKWVpaaUpKW8wsa9w8e7wsaVpaaVpaabqaulsbOcqqyLmpqWpqeUpKWUpKWUpKW9w8e8wsa9w8e8wsa9w8e9w8e2u7+1u7+ZnqG8wsa8wsa9w8efrK6bqquVpaa7wcWVpaaPnp+1vcCQn6CWpaeVpaaaqaqWnJ+yu76UpKWVpaa9w8e8wsa7wcWstrmlsbOcqqyWpqeWpaa1vcC2vsGyu76Qa3sVAAAANnRSTlP++YX+BfmE/gD+/peV/NeVl/4v+P7+/gj+L/i+/b781/bXCAgBL/gv/oWV/tcI/gj+/YQF/pcfdpW2AAAB1UlEQVRo3u2ah26DMBCGndL0Svae3XvvQmbH+79UE0QqDNjG+Gik9E4nIqEkX/4PYxnFbDfjYhsJONtOVq+pAJfV46NcPv/b+Vx8Lw8v+oCT2h5z3WC7LL6XB3tHF3C6z3QK7C1NQC36W2UJHEedgQOcH+gCQEngAFWmV7AolSUOcOhqJ1Ba4gAXaQAKSxyApVCkssQDUiWQW0IByCxhKJJawkkgsYQFEFpCUiS2hJZAZMkI8MEB4i0ZKWoBKC0ZJZjyCWItGQE+w4AYS0aKWBtAZckogTu+clSWzADu7VRlyUzRoh7arZ7N1zViAq9HbMQ3NiDSqIriKlGCVd5Ifr/DJ5IlCLxpMeC89l8iHT6hrQg0S1vRalxHxrnf4RMpFGUB+MtRlM19sFE3GiVY01wUKFuz/uFUkflsSlMFKaK5iOYimovoRqNrQM9o9IxGdzIpIkWkaL0J6jgJ6kJAAQdQEAIsHIAlBHRwLkFHCBhMMBJMBkJAZf5mDvieV4SAEjxZpn6sHpSEgH4ZnJn1NQ4ueJKui5Y9Lkxm4Dz3xZsGiv7fJIFOui7y2vt4UbIroTsE4xo+yjZudIvl0Hok6bLF7/L7vWLrSaN010wLaFZuGuHv+wHELr0xAczAJQAAAABJRU5ErkJggg==';
    }

    const attachment = {
      id: generateUniqueId(),
      name: file.name,
      size: prettifyFileSize(file.size),
      previewUrl,
      file,
    };
    files.push(attachment);

    this.setState({ files });
  }

  removeAttachedFile(fileId: string): void {
    const { files } = this.state;

    this.setState({ files: files.filter((f) => f.id !== fileId) });
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
