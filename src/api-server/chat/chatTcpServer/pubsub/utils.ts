import { parse, inject } from 'regexparam';
import { EventNames, EventsMap, IEvent } from './models/event';

export const getParsedEventName = (ev: string, params: any): string => {
  const parsed = parse(ev);
  if (parsed.keys.length === 0) return ev;

  const eventName = inject(ev, params as any) as any;
  // TODO: Enable validation again
  /* const isValid = parsed.pattern.test(eventName);
  if (!isValid) {
    throw new Error(
      `Event name ${eventName} does not match the required pattern: ${ev}`
    );
  } */
  return eventName;
};

export function getEventName<
  TEventMap extends EventsMap,
  Ev extends EventNames<TEventMap>
>(ev: Ev | IEvent<Ev>): { name: Ev; parsedName: Ev; params: any } {
  let eventName: string;
  let eventNameParams: any;

  if (typeof ev === 'string') {
    eventName = ev;
  } else {
    const { name, ...params } = ev as IEvent<Ev>;
    eventName = name;
    eventNameParams = params;
  }

  const parsedEventName = getParsedEventName(
    eventName as string,
    eventNameParams
  ) as any;

  return {
    name: eventName as Ev,
    parsedName: parsedEventName,
    params: eventNameParams,
  };
}
