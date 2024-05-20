import { ClientToServerEvents, ServerToClientEvents } from '../../events';
import { EventNames, EventParams, EventsMap, IEvent } from './event';

export interface EventEmitter<Events extends EventsMap> {
  publish<Ev extends EventNames<Events>>(
    ev: Ev | IEvent<Ev>,
    ...args: EventParams<Events, Ev>
  ): void;
}

export type IServerEventEmitter = EventEmitter<ServerToClientEvents>;
export type IClientEventEmitter = EventEmitter<ClientToServerEvents>;
