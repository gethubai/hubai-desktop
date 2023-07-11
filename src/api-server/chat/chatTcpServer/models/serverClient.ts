import { Socket } from 'socket.io-client';
import { ClientToServerEvents } from '../events/clientEvents';
import { ServerToClientEvents } from '../events/serverEvents';

export type ChatClientSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;
