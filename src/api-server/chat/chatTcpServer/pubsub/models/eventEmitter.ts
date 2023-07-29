import { ClientToServerEvents, ServerToClientEvents } from '../../events';
import { EventNames, EventParams, EventsMap, IEvent } from './event';

export interface EventEmitter<Events extends EventsMap> {
  publish<Ev extends EventNames<Events>>(
    ev: Ev | IEvent<Ev>,
    ...args: EventParams<Events, Ev>
  ): void;
}

export interface IServerEventEmitter
  extends EventEmitter<ServerToClientEvents> {}

export interface IClientEventEmitter
  extends EventEmitter<ClientToServerEvents> {}
