import { ClientToServerEvents } from '../../events';
import { EventParams, IEvent } from '../../pubsub/models/event';
import { IClientEventEmitter } from '../../pubsub/models/eventEmitter';
import { getEventName } from '../../pubsub/utils';
import { ChatClientSocket } from '../models/serverClient';

export class SocketIoClientEventEmitter implements IClientEventEmitter {
  constructor(private socket: ChatClientSocket) {}

  publish<Ev extends keyof ClientToServerEvents>(
    ev: Ev | IEvent<Ev>,
    ...args: EventParams<ClientToServerEvents, Ev>
  ) {
    // We don't parse the event name here because socket-io does not support wildcards in the event name
    const { name } = getEventName(ev);
    this.socket.emit(name, ...args);
  }
}
