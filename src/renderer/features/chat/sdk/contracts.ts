import {
  MessageReceivedEvent,
  MessageUpdatedEvent,
} from 'api-server/chat/chatTcpServer/events/serveSessionEvents';
import {
  ChatMemberType,
  ChatModel,
  ChatUser,
} from 'api-server/chat/domain/models/chat';
import { ChatMessagesContext } from 'api-server/chat/domain/models/chatContext';
import {
  IRecipientSettings,
  ImageMessage,
  RawVoiceMessage,
  TextMessage,
  VoiceMessage,
} from 'api-server/chat/domain/models/chatMessage';
import { ChatCreatedEvent } from 'api-server/chat/chatTcpServer/events';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { IServerEventSubscriber } from 'api-server/chat/chatTcpServer/pubsub/models/eventSubscriber';

export type ChatClientUser = {
  id: string;
  name: string;
  type: ChatMemberType;
  accessToken?: string;
};

export type SendMessage = {
  text?: TextMessage;

  image?: ImageMessage;

  voice?: VoiceMessage;

  attachments?: File[];

  brainsSettings?: IRecipientSettings;

  hidden?: boolean;
};

export interface IChatSessionServer {
  watch(): Promise<void>;
  unwatch(): void;
  onMessageUpdated(listener: (data: MessageUpdatedEvent.Params) => void): void;
  onChatUpdated(listener: (data: ChatModel) => void): void;
  onMessageReceived(
    listener: (data: MessageReceivedEvent.Params) => void
  ): void;
  sendMessage(options: SendMessage): Promise<void>;
  sendAudio(audio: RawVoiceMessage): Promise<VoiceMessage>;
  sendTranscription(messageId: string, text: TextMessage): Promise<void>;
  messages(): Promise<ChatMessagesContext>;
  addMember(user: ChatUser): void;
  removeMember(id: string): void;
  dispose(): void;

  getSettings(): Promise<IRecipientSettings | undefined>;
  handleEvent(event: string, args: any): void;
  onUnwatch(listener: () => void): void;

  isWatching: boolean;
  id: string;
}

export type ChatListFilters = {
  /* Chat that contains this userId as a member */
  userId?: string | string[];
  /* If true, return only direct chats (1-1) */
  isDirect?: boolean;
};

export interface IChatClient {
  connect(user: ChatClientUser): Promise<void>;

  get<TResponse>(url: string, params?: any): Promise<TResponse>;
  post<TResponse>(url: string, data?: any): Promise<TResponse>;
  sendFile<TResponse>(
    url: string,
    uri: string | Buffer | File | Blob,
    name?: string,
    contentType?: string
  ): Promise<TResponse>;
  delete<TResponse>(url: string, data?: any): Promise<TResponse>;
  put<TResponse>(url: string, data?: any): Promise<TResponse>;
  getSubscriber(): IServerEventSubscriber;
  session(sessionId: string): IChatSessionServer;
  removeSession(session: IChatSessionServer): void;
  onChatCreated(listener: (params: ChatCreatedEvent.Params) => void): void;
  onChatUpdated(listener: (chat: ChatModel) => void): void;
  onJoinedChat(listener: (chat: ChatModel) => void): void;
  onLeftChat(listener: (chat: ChatModel) => void): void;
  newChat(options: CreateChat.Params): Promise<ChatModel>;
  removeChat(id: string): Promise<void>;

  chats(filters?: ChatListFilters): Promise<ChatModel[]>;
  chat(id: string): Promise<ChatModel>;
  currentUser(): ChatClientUser;
}
