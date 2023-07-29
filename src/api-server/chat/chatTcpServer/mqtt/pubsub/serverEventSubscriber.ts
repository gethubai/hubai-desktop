import { ServerToClientEvents } from '../../events';
import { IServerEventSubscriber } from '../../pubsub/models/eventSubscriber';
import { MqttEventSubscriber } from './eventSubscriber';

export class MqttServerEventSubscriber
  extends MqttEventSubscriber<ServerToClientEvents>
  implements IServerEventSubscriber {}
