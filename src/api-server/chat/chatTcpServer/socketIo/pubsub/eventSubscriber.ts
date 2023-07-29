import { Socket } from 'socket.io-client';

import { getEventName } from '../../pubsub/utils';
import {
  IEventSubscriber,
  ISubscription,
} from '../../pubsub/models/eventSubscriber';
import { EventNames, EventsMap, IEvent } from '../../pubsub/models/event';

export class SocketIoEventSubscriber<
  TEventMap extends EventsMap,
  TSocket extends Socket<TEventMap, any>
> implements IEventSubscriber<TEventMap>
{
  constructor(
    private readonly socket: TSocket,
    private readonly userId?: string
  ) {}

  subscribeToUserEvent<Ev extends EventNames<TEventMap>>(
    ev: Ev,
    listener: (...args: Parameters<TEventMap[Ev]>) => void
  ): ISubscription {
    if (!this.userId) {
      throw new Error('userId is not defined');
    }

    return this.subscribe({ name: ev, user: this.userId }, listener);
  }

  subscribe<Ev extends EventNames<TEventMap>>(
    ev: Ev | IEvent<Ev>,
    listener: (...args: Parameters<TEventMap[Ev]>) => void
  ): ISubscription {
    const { name, parsedName } = getEventName<TEventMap, Ev>(ev);
    console.log(`Subscribed to ${name} -> ${parsedName}`);
    this.socket.on(parsedName, listener as any);

    return {
      name: parsedName,
      unsubscribe: () => this.unsubscribe(parsedName, listener as any),
    };
  }

  unsubscribe<Ev extends EventNames<TEventMap>>(
    ev: Ev | IEvent<Ev>,
    listener: (...args: Parameters<TEventMap[Ev]>) => void
  ): void {
    const { parsedName } = getEventName<TEventMap, Ev>(ev);

    this.socket.off(parsedName, listener as any);
    console.log(`Unsubscribed from -> ${parsedName}`);
  }
}
