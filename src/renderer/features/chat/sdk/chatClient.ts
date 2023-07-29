import { ChatModel } from 'api-server/chat/domain/models/chat';
import { ChatCreatedEvent } from 'api-server/chat/chatTcpServer/events';
import { ChatServerConfigs, ServerPort } from 'api-server/consts';
import { CreateChat } from 'api-server/chat/domain/usecases/createChat';
import { IServerEventSubscriber } from 'api-server/chat/chatTcpServer/pubsub/models/eventSubscriber';
import { IClientEventEmitter } from 'api-server/chat/chatTcpServer/pubsub/models/eventEmitter';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  JoinChatEvent,
  LeftChatEvent,
} from 'api-server/chat/chatTcpServer/events/serveSessionEvents';
import { MqttClientEventEmitter } from 'api-server/chat/chatTcpServer/mqtt/pubsub/clientEventEmitter';
import { MqttServerEventSubscriber } from 'api-server/chat/chatTcpServer/mqtt/pubsub/serverEventSubscriber';
import { connect } from 'mqtt';
import { ChatClientUser, IChatClient, IChatSessionServer } from './contracts';
import { ChatSessionServer } from './chatSessionServer';
import { isBlobWebAPI, isBuffer, isFileWebAPI } from './fileUtils';

export class ChatClient implements IChatClient {
  private listeners: Record<string, Array<(...args: any[]) => void>> = {};

  private activeSessions: Record<string, IChatSessionServer> = {};

  private user!: ChatClientUser;

  private subscriber!: IServerEventSubscriber;

  private eventEmitter!: IClientEventEmitter;

  private httpClient!: AxiosInstance;

  constructor() {
    this.listeners = {};
  }

  currentUser = (): ChatClientUser => {
    return this.user;
  };

  connect = async (user: ChatClientUser): Promise<void> => {
    this.user = user;

    this.httpClient = axios.create({
      timeout: 3000,
      withCredentials: false,
      baseURL: `${ChatServerConfigs.address}/api`,
    });

    this.httpClient.defaults.headers.common['User-Id'] = this.user.id;
    this.initMqtt();

    this.subscriber.subscribeToUserEvent(ChatCreatedEvent.Name, (params) => {
      this.callListeners(ChatCreatedEvent.Name, params);
    });

    this.subscriber.subscribeToUserEvent(JoinChatEvent.Name, (params) => {
      this.callListeners(JoinChatEvent.Name, params);
    });

    this.subscriber.subscribeToUserEvent(LeftChatEvent.Name, (params) => {
      this.callListeners(LeftChatEvent.Name, params);
    });
  };

  initMqtt = async (): Promise<void> => {
    const client = connect(`ws://localhost:${ServerPort}`, {
      username: this.user.id,
      password: this.user.accessToken,
    });

    client.on('connect', () => {
      console.log('Connect to chat server');
    });

    this.eventEmitter = new MqttClientEventEmitter(client);

    this.subscriber = new MqttServerEventSubscriber(client, this.user.id);
  };

  /*
  Uncomment to use socket.io transport
   initWebSocket = async (): Promise<void> => {
    const serverAdd = `${ChatServerConfigs.address}${ChatServerConfigs.mainNamespace}`;
    this.clientSocket = io(serverAdd, {
      query: {
        id: this.user.id,
      },
    });
    this.eventEmitter = new SocketIoClientEventEmitter(this.clientSocket);
    this.subscriber = new SocketIoServerEventSubscriber(
      this.clientSocket,
      this.user.id
    );
  }; */

  session = (sessionId: string): IChatSessionServer => {
    let session: IChatSessionServer = this.activeSessions[sessionId];
    if (!session) {
      session = new ChatSessionServer(sessionId, this);
      this.activeSessions[sessionId] = session;
    }
    return session;
  };

  removeSession = (session: IChatSessionServer): void => {
    delete this.activeSessions[session.id];
  };

  onChatCreated = (listener: (params: ChatModel) => void): void => {
    this.addListener(ChatCreatedEvent.Name, listener);
  };

  onJoinedChat = (listener: (params: ChatModel) => void): void => {
    this.addListener(JoinChatEvent.Name, listener);
  };

  onLeftChat = (listener: (chat: ChatModel) => void): void => {
    this.addListener(LeftChatEvent.Name, listener);
  };

  newChat = (options: CreateChat.Params): Promise<ChatModel> => {
    return this.post<ChatModel>(`/chats`, {
      name: options.name,
      members: options.members,
    });
  };

  chats = (): Promise<ChatModel[]> => {
    return this.get<ChatModel[]>(`/chats`);
  };

  chat = (id: string): Promise<ChatModel> => {
    return this.get<ChatModel>(`/chats/${id}`);
  };

  addListener = (event: string, listener: (...args: any[]) => void): void => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  };

  callListeners = (event: string, ...args: any[]): void => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((l) => l(...args));
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

  getSubscriber = (): IServerEventSubscriber => {
    return this.subscriber;
  };

  get = async <TResponse>(
    url: string,
    params?: AxiosRequestConfig['params']
  ): Promise<TResponse> => {
    const r = await this.httpClient.get<TResponse>(url, { params });
    return r.data;
  };

  post = async <TResponse>(
    url: string,
    data?: AxiosRequestConfig['params']
  ): Promise<TResponse> => {
    const r = await this.httpClient.post<TResponse>(url, data);
    return r.data;
  };

  delete = async <TResponse>(
    url: string,
    data?: AxiosRequestConfig['params']
  ): Promise<TResponse> => {
    const r = await this.httpClient.delete<TResponse>(url, data);
    return r.data;
  };

  put = async <TResponse>(
    url: string,
    data?: AxiosRequestConfig['params']
  ): Promise<TResponse> => {
    const r = await this.httpClient.put<TResponse>(url, data);
    return r.data;
  };

  sendFile = async <TResponse>(
    url: string,
    uri: string | Buffer | File | Blob,
    name?: string,
    contentType?: string
  ): Promise<TResponse> => {
    const data = new FormData();

    if (isBuffer(uri) || isFileWebAPI(uri) || isBlobWebAPI(uri)) {
      if (name) {
        data.append('file', uri as any, name);
      } else data.append('file', uri as any);
    } else {
      data.append('file', {
        uri,
        name: name || (uri as string).split('/').reverse()[0],
        contentType,
        type: contentType,
      } as any);
    }

    const r = await this.httpClient.post<TResponse>(url, data);
    return r.data;
  };
}
