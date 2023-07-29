import { ServerToClientEvents } from '../../events';
import { ChatNamespace } from '../models/server';
import { EventNames, EventParams, IEvent } from '../../pubsub/models/event';
import { IServerEventEmitter } from '../../pubsub/models/eventEmitter';
import { getEventName } from '../../pubsub/utils';

export class SocketIoServerEventEmitter implements IServerEventEmitter {
  constructor(private readonly server: ChatNamespace) {}

  publish = <Ev extends EventNames<ServerToClientEvents>>(
    ev: Ev | IEvent<Ev>,
    ...args: EventParams<ServerToClientEvents, Ev>
  ) => {
    const { parsedName } = getEventName(ev);
    console.log(`publishing event ${parsedName}`);
    this.server.emit(parsedName, ...args);
  };

  /* private getClientRoom(id: string | string[]): string | string[] {
    if (Array.isArray(id)) {
      return id.map((i) => this.getClientRoom(i) as string);
    }
    return `chatClient:${id}`;
  } */
}
