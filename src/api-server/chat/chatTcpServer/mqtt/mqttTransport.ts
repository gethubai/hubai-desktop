import { connect } from 'mqtt';
import { ServerPort } from 'api-server/consts';
import keyStore from 'data/keyStore';

import { IServerEventEmitter } from '../pubsub/models/eventEmitter';
import { IChatTransport, ServerListener } from '../models/chatTransport';
import { IChatServerClient } from '../models/chatServerClient';
import { MqttServerEventEmitter } from './pubsub/serverEventEmitter';

export class MqttTransport implements IChatTransport {
  eventEmitter: IServerEventEmitter;

  listener: ServerListener;

  constructor() {
    const client = connect(`ws://localhost:${ServerPort}`, {
      username: 'master',
      password: keyStore.get(),
    });
    this.listener = new ServerListener();
    this.eventEmitter = new MqttServerEventEmitter(client);

    client.on('connect', () => {
      console.log('Master client connected');
    });
  }

  onConnection = (listener: (client: IChatServerClient) => void) => {
    this.listener.addListener('connection', listener);
  };
}
