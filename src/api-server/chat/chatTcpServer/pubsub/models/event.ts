export interface IEvent<TEvent> {
  name: TEvent; // Event name\
  [key: string]: any;
}

export interface EventsMap {
  [event: string]: any;
}

export declare type EventNames<Map extends EventsMap> = keyof Map &
  (string | symbol);

export declare type EventParams<
  Map extends EventsMap,
  Ev extends EventNames<Map>,
> = Parameters<Map[Ev]>;

export interface IEventNameParams {
  [key: string]: string | number;
}
