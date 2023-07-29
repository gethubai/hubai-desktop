import { ClientToServerEvents } from '../../events';
import { ChatSocket } from '../models/server';
import { EventNames, IEvent } from '../../pubsub/models/event';
import {
  IClientEventSubscriber,
  ISubscription,
} from '../../pubsub/models/eventSubscriber';
import { getEventName } from '../../pubsub/utils';

export class SocketIoClientEventSubscriber implements IClientEventSubscriber {
  constructor(private readonly socket: ChatSocket) {}

  subscribe<Ev extends EventNames<ClientToServerEvents>>(
    ev: Ev | IEvent<Ev>,
    listener: (...args: Parameters<ClientToServerEvents[Ev]>) => void
  ): ISubscription {
    const { name } = getEventName(ev);
    // const eventName = getParsedEventName(ev, eventNameParams) as any;

    console.log(`SocketIO Subscribed to ${name}`);

    // We don't parse the event name here because socket.io does not support wildcards /test/?/foo for example
    this.socket.on(name, listener as any);

    return {
      name,
      unsubscribe: () => this.unsubscribe(name, listener as any),
    };
  }

  unsubscribe<Ev extends EventNames<ClientToServerEvents>>(
    ev: Ev | IEvent<Ev>,
    listener?: (...args: Parameters<ClientToServerEvents[Ev]>) => void
  ): void {
    const { name } = getEventName(ev);

    // const eventName = getParsedEventName(ev, eventNameParams) as any;

    console.log(`SocketIO unsubscribed from ${name}`);

    // We don't parse the event name here because socket.io does not support wildcards /test/?/foo for example
    this.socket.off(name, listener as any);
  }
}
