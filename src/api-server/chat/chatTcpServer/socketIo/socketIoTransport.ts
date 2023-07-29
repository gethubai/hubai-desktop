/* eslint-disable max-classes-per-file */
import { ChatNamespace } from './models/server';
import { IServerEventEmitter } from '../pubsub/models/eventEmitter';
import { SocketIoClientEventSubscriber } from './pubsub/clientEventSubscriber';
import { SocketIoServerEventEmitter } from './pubsub/serverEventEmitter';
import { IChatTransport, ServerListener } from '../models/chatTransport';
import { IChatServerClient } from '../models/chatServerClient';

export class SocketIoTransport implements IChatTransport {
  eventEmitter: IServerEventEmitter;

  listener: ServerListener;

  constructor(private readonly server: ChatNamespace) {
    this.eventEmitter = new SocketIoServerEventEmitter(server);
    this.listener = new ServerListener();

    server.on('connection', (socket) => {
      const { id } = socket.handshake.query;
      const client = {
        id,
        subscriber: new SocketIoClientEventSubscriber(socket),
        onDisconnect: (listener: () => void) => {
          socket.on('disconnect', listener);
        },
      } as IChatServerClient;

      this.listener.callListeners('connection', client);
    });
  }

  onConnection = (listener: (client: IChatServerClient) => void) => {
    this.listener.addListener('connection', listener);
  };
}
