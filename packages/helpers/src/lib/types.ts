// eslint-disable-next-line ts/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
