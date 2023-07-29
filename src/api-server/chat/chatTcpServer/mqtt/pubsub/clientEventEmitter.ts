import { MqttClient } from 'mqtt';
import { ClientToServerEvents } from '../../events';
import { EventParams, IEvent } from '../../pubsub/models/event';
import { IClientEventEmitter } from '../../pubsub/models/eventEmitter';
import { getEventName } from '../../pubsub/utils';

export class MqttClientEventEmitter implements IClientEventEmitter {
  constructor(private client: MqttClient) {}

  publish<Ev extends keyof ClientToServerEvents>(
    ev: Ev | IEvent<Ev>,
    ...args: EventParams<ClientToServerEvents, Ev>
  ) {
    const { name } = getEventName(ev);

    // TODO: Maybe use a faster serialization method like protobuf?
    this.client.publish(name, JSON.stringify(args));
  }
}
