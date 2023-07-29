/* eslint-disable no-restricted-syntax */
import Aedes from 'aedes';
// import websocket from 'ws';
import { ServerToClientEventsName } from 'api-server/chat/chatTcpServer/events';
import { MqttTransport } from 'api-server/chat/chatTcpServer/mqtt/mqttTransport';
import chatServer from 'api-server/chat/chatTcpServer/server';
import keyStore from 'data/keyStore';
import { Server } from 'http';
import { parse } from 'regexparam';
import ws from 'websocket-stream';

export const setupMqttAedesServer = (httpServer: Server): void => {
  const aedes = new Aedes();

  let masterClientId = '';

  aedes.authenticate = (client, username, password, callback) => {
    // master/server client
    if (username === 'master') {
      const rawPassword = password?.toString();
      // TODO: Also check if masterClientId is already set?
      if (rawPassword !== keyStore.get()) {
        // check if password is correct
        const error = new Error('Wrong master credentials');
        console.error(error, username, rawPassword);
        callback({ ...error, returnCode: 4 }, null);
        return;
      }

      console.log('Master client connected:', masterClientId);
      masterClientId = client.id;
    }
    // TODO: Validate JWT Token
    callback(null, true);
  };

  aedes.authorizePublish = (client, packet, callback) => {
    if (!client) return callback(new Error('Invalid client'));

    for (const eventName of ServerToClientEventsName) {
      const eventParse = parse(eventName);

      if (
        eventParse.pattern.test(packet.topic) &&
        client.id !== masterClientId
      ) {
        console.warn(
          `Client: ${client?.id} trying to publish to server event: ${eventName}`
        );
        return callback(
          new Error('You do not have permission to send this kind of packet')
        );
      }
    }

    return callback(null);
  };

  ws.createServer({ server: httpServer }, aedes.handle);

  aedes.on('client', (client) => {
    console.log('client connected', client.id);
  });

  aedes.on('subscribe', (subscriptions, client) => {
    console.log('client subscribed', subscriptions, client.id);
  });

  aedes.on('unsubscribe', (subscriptions, client) => {
    console.log('client unsubscribed', subscriptions, client.id);
  });

  aedes.on('ack', (message, client) => {
    console.log("%s ack'd message", client.id, message);
  });

  const transport = new MqttTransport();

  chatServer.startServer(transport);
};
