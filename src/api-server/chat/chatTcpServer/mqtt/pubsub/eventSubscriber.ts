import { MqttClient } from 'mqtt';
import { parse } from 'regexparam';
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
      // get subscriptions that match the topic with wildcards, for example:
      // topic: chat/1234/messages should match subscriptions that has the key: chat/+/messages

      // eslint-disable-next-line no-restricted-syntax
      Object.keys(this.subscriptions).forEach((subscriptionKey) => {
        if (subscriptionKey === topic) {
          this.callListeners(subscriptionKey, message);
          return;
        }

        if (!subscriptionKey.includes('#') && !subscriptionKey.includes('+')) {
          return;
        }

        // Replace MQTT wildcard characters with regex equivalents
        const transformedKey = subscriptionKey
          .replace('+', '[^/]+')
          .replace('#', '.*');

        // Use regexparam to create a RegExp pattern
        const { pattern } = parse(transformedKey);

        // If the pattern matches the topic, call the listener
        if (pattern.test(topic)) {
          this.callListeners(subscriptionKey, message);
        }
      });
    });
  }

  callListeners(name: string, message: Buffer) {
    const listener = this.subscriptions[name];
    if (listener) {
      listener(JSON.parse(message.toString()));
    }
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
