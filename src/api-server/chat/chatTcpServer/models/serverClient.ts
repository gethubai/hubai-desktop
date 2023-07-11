import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../events';

export type ChatClientSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;
