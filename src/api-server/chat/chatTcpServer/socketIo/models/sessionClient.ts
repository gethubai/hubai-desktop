import { Socket } from 'socket.io-client';
import { SessionServerToClientEvents } from '../../events/serveSessionEvents';
import { SessionClientToServerEvents } from '../../events/clientSessionEvents';

export type SessionChatClientSocket = Socket<
  SessionServerToClientEvents,
  SessionClientToServerEvents
>;
