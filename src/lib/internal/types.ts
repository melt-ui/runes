export type Arrayable<T> = T | T[];

// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type EventHandler<E extends Event = Event> = (event: E) => void;
