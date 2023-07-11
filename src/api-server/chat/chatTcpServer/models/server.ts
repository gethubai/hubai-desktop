import { Namespace, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../events';

export type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type ChatNamespace = Namespace<
  ClientToServerEvents,
  ServerToClientEvents
>;
