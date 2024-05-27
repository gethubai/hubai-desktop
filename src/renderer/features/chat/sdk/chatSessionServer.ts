import {
  ChatMemberStatusChangedEventName,
  ChatUpdatedEventName,
  MessageReceivedEventName,
  MessageSentEventName,
  MessageTranscribedEventName,
  MessageUpdatedEventName,
  ChatMemberStatusChangedEventParams,
  ChatUpdatedEventParams,
  MessageReceivedEventParams,
  MessageUpdatedEventParams,
} from 'api-server/chat/chatTcpServer/events/serveSessionEvents';
import { ChatUser } from 'api-server/chat/domain/models/chat';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import {
  ChatMessageModel,
  IRecipientSettings,
  RawVoiceMessage,
  TextMessage,
  VoiceMessage,
} from 'api-server/chat/domain/models/chatMessage';
import { IDisposable } from '@hubai/core/esm/monaco/common';
import { ISubscription } from 'api-server/chat/chatTcpServer/pubsub/models/eventSubscriber';
import { IChatClient, IChatSessionServer, SendMessage } from './contracts';

export class ChatSessionServer implements IChatSessionServer, IDisposable {
  private listeners: Record<string, Array<(...args: any[]) => void>> = {};

  isWatching: boolean;

  createdAt: string;

  eventSubscriptions: ISubscription[];

  constructor(
    public readonly id: string,
    private client: IChatClient
  ) {
    this.listeners = {};
    this.isWatching = false;
    this.eventSubscriptions = [];
    this.createdAt = new Date().toISOString();
  }

  watch = (): Promise<void> => {
    if (this.isWatching) return Promise.resolve();

    this.isWatching = true;

    const addEventSubscription = (eventName: string): ISubscription => {
      const handler = (args: any) => this.handleEvent(eventName, args);

      return this.client.getSubscriber().subscribe(
        {
          name: eventName as any,
          chatId: this.id,
          user: this.client.currentUser().id,
        },
        handler
      );
    };

    this.eventSubscriptions = [
      addEventSubscription(MessageReceivedEventName),
      addEventSubscription(MessageUpdatedEventName),
      addEventSubscription(MessageTranscribedEventName),
      addEventSubscription(MessageSentEventName),
      addEventSubscription(ChatUpdatedEventName),
      addEventSubscription(ChatMemberStatusChangedEventName),
    ];

    return Promise.resolve();
  };

  unwatch(): void {
    this.isWatching = false;
    this.eventSubscriptions.forEach((s) => s.unsubscribe());
    this.eventSubscriptions = [];
    this.callListeners('unwatch');
    this.listeners = {};
  }

  handleEvent = (event: string, args: any): void => {
    this.callListeners(event, args);
  };

  onMessageUpdated = (
    listener: (data: MessageUpdatedEventParams) => void
  ): void => {
    this.addListener(MessageUpdatedEventName, listener);
  };

  onChatUpdated = (listener: (data: ChatUpdatedEventParams) => void): void => {
    this.addListener(ChatUpdatedEventName, listener);
  };

  onMessageReceived = (
    listener: (data: MessageReceivedEventParams) => void
  ): void => {
    this.addListener(MessageReceivedEventName, listener);
  };

  onMemberStatusChanged = (
    listener: (data: ChatMemberStatusChangedEventParams) => void
  ): void => {
    this.addListener(ChatMemberStatusChangedEventName, listener);
  };

  sendAudio = async (audio: RawVoiceMessage): Promise<VoiceMessage> => {
    const result = await this.client.sendFile<VoiceMessage>(
      this.getSessionUrl('/upload/file'),
      audio.data,
      'audio_file',
      audio.mimeType
    );

    return result;
  };

  messages = (): Promise<ChatMessagesContext> => {
    return this.client.get<ChatMessagesContext>(
      this.getSessionUrl('/messages')
    );
  };

  sendTranscription = async (
    messageId: string,
    transcription: TextMessage
  ): Promise<void> => {
    await this.client.put(
      this.getSessionUrl(`/messages/${messageId}/transcription`),
      { messageId, transcription: transcription.body }
    );
  };

  sendTyping(isTyping: boolean): Promise<void> {
    return this.client.put(this.getSessionUrl('/memberStatus'), {
      isTyping,
    });
  }

  getSessionUrl = (append?: string): string =>
    `/chats/${this.id}${append ?? ''}`;

  sendMessage = async ({
    text,
    image,
    voice,
    hidden,
    attachments,
    isSystemMessage,
  }: SendMessage): Promise<void> => {
    const formData = new FormData();

    const request = {
      chatId: this.id,
      text,
      image,
      voice,
      hidden,
      isSystemMessage,
      attachments,
    };

    formData.append('jsonData', JSON.stringify(request));

    attachments?.forEach((a) => {
      formData.append('files', a);
    });

    await this.client.post<ChatMessageModel>(
      this.getSessionUrl('/messages'),
      formData
    );
  };

  addMember = (user: ChatUser): void => {
    this.client.post(this.getSessionUrl('/members'), {
      chatId: this.id,
      member: user,
    });
  };

  removeMember = (id: string): void => {
    this.client.delete(this.getSessionUrl(`/members/${id}`), {
      chatId: this.id,
      memberId: id,
    });
  };

  getSettings = async (): Promise<IRecipientSettings | undefined> => {
    // TODO: Refactor this and call an endpoint to get the settings (this would improve performance by not having to get the whole chat)
    const chat = await this.client.chat(this.id);

    // eslint-disable-next-line no-restricted-syntax
    for (const member of chat.members) {
      if (member.id === this.client.currentUser().id) {
        return member.settings;
      }
    }
    return undefined;
  };

  addListener = (event: string, listener: (...args: any[]) => void): void => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  };

  removeListener = (
    event: string,
    listener: (...args: any[]) => void
  ): void => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
  };

  callListeners = (event: string, ...args: any[]): void => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((l) => l(...args));
  };

  onUnwatch(listener: () => void): void {
    this.addListener('unwatch', listener);
  }

  dispose = () => {
    if (this.isWatching) this.unwatch();

    this.listeners = {};
    this.client.removeSession(this);
  };
}
