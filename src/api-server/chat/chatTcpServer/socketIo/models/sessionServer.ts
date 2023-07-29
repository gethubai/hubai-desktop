import { Namespace, Socket } from 'socket.io';
import { SessionClientToServerEvents } from '../../events/clientSessionEvents';
import { SessionServerToClientEvents } from '../../events/serveSessionEvents';

export type ChatSessionSocket = Socket<
  SessionClientToServerEvents,
  SessionServerToClientEvents
>;
export type ChatSessionNamespace = Namespace<
  SessionClientToServerEvents,
  SessionServerToClientEvents
>;
