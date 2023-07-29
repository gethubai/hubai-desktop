import { MqttClient } from 'mqtt';
import { ServerToClientEvents } from '../../events';
import { EventNames, EventParams, IEvent } from '../../pubsub/models/event';
import { IServerEventEmitter } from '../../pubsub/models/eventEmitter';
import { getEventName } from '../../pubsub/utils';

export class MqttServerEventEmitter implements IServerEventEmitter {
  constructor(private readonly client: MqttClient) {}

  publish = <Ev extends EventNames<ServerToClientEvents>>(
    ev: Ev | IEvent<Ev>,
    ...args: EventParams<ServerToClientEvents, Ev>
  ) => {
    const { parsedName } = getEventName(ev);

    this.client.publish(parsedName, JSON.stringify(...args));
  };
}
