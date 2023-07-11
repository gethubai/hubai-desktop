import { Namespace, Socket } from 'socket.io';
import { ClientToServerEvents } from '../events/clientEvents';
import { ServerToClientEvents } from '../events/serverEvents';

export type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type ChatNamespace = Namespace<
  ClientToServerEvents,
  ServerToClientEvents
>;
