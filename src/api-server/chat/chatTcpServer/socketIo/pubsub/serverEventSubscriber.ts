/* eslint-disable max-classes-per-file */
import { ServerToClientEvents } from '../../events';
import { ChatClientSocket } from '../models/serverClient';
import { IServerEventSubscriber } from '../../pubsub/models/eventSubscriber';
import { SocketIoEventSubscriber } from './eventSubscriber';

export class SocketIoServerEventSubscriber
  extends SocketIoEventSubscriber<ServerToClientEvents, ChatClientSocket>
  implements IServerEventSubscriber {}
