import { MqttClient } from 'mqtt';
import { getEventName } from '../../pubsub/utils';
import {
  IEventSubscriber,
  ISubscription,
} from '../../pubsub/models/eventSubscriber';
import { EventNames, EventsMap, IEvent } from '../../pubsub/models/event';

export class MqttEventSubscriber<TEventMap extends EventsMap>
  implements IEventSubscriber<TEventMap>
{
  private subscriptions: Record<string, Function> = {};

  constructor(
    private readonly client: MqttClient,
    private readonly userId?: string
  ) {
    client.on('message', (topic, message) => {
      const listener = this.subscriptions[topic];
      if (listener) {
        listener(JSON.parse(message.toString()));
      }
    });
  }

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
    const { parsedName } = getEventName<TEventMap, Ev>(ev);

    this.client.subscribe(parsedName as string);

    this.subscriptions[parsedName as string] = listener;

    return {
      name: parsedName,
      unsubscribe: () => this.unsubscribe(parsedName, listener),
    };
  }

  unsubscribe<Ev extends EventNames<TEventMap>>(
    ev: Ev | IEvent<Ev>,
    listener: (...args: Parameters<TEventMap[Ev]>) => void
  ): void {
    const { parsedName } = getEventName<TEventMap, Ev>(ev);

    this.client.unsubscribe(parsedName as string);
    delete this.subscriptions[parsedName as string];
  }
}
