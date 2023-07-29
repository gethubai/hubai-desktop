import { IClientEventSubscriber } from '../pubsub/models/eventSubscriber';

export interface IChatServerClient {
  id: string;
  subscriber: IClientEventSubscriber;
  onDisconnect: (listener: () => void) => void;
}
