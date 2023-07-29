import { ClientToServerEvents, ServerToClientEvents } from '../../events';
import { SessionClientToServerEvents } from '../../events/clientSessionEvents';
import { EventNames, EventParams, EventsMap, IEvent } from './event';

export interface ISubscription {
  name: string;
  unsubscribe: () => void;
}

export interface IEventSubscriber<Events extends EventsMap> {
  subscribe<Ev extends EventNames<Events>>(
    ev: Ev | IEvent<Ev>,
    listener: (...args: EventParams<Events, Ev>) => void
  ): ISubscription;

  unsubscribe<Ev extends EventNames<Events>>(
    ev: Ev | IEvent<Ev>,
    listener?: (...args: EventParams<Events, Ev>) => void
  ): void;
}

export interface IServerEventSubscriber
  extends IEventSubscriber<ServerToClientEvents> {
  subscribeToUserEvent<Ev extends EventNames<ServerToClientEvents>>(
    ev: Ev | IEvent<Ev>,
    listener: (...args: EventParams<ServerToClientEvents, Ev>) => void
  ): void;
}

export interface IClientEventSubscriber
  extends IEventSubscriber<
    ClientToServerEvents & SessionClientToServerEvents
  > {}
