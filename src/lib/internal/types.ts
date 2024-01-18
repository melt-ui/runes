export type ChangeFn<T> = (value: T) => T;

// Check if type are equal or just extends
export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
	G,
>() => G extends U ? 1 : 2
	? Y
	: N;

export type Nullable<T> = T | null;

export type ValueOf<T> = T[keyof T];

export type Arrayable<T> = T | T[];

type NullableKeys<T> = {
	[K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

export type Defaults<T> = {
	[K in NullableKeys<T>]?: T[K];
};

export type TextDirection = "ltr" | "rtl";

export type Orientation = "horizontal" | "vertical";

// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type Expand<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: O[K] }
		: never
	: T;

export type ExpandDeep<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: ExpandDeep<O[K]> }
		: never
	: T;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type EventHandler<T extends Event = Event> = (event: T) => void;

export type WhenTrue<TrueOrFalse, IfTrue, IfFalse, IfNeither = IfTrue | IfFalse> = [
	TrueOrFalse,
] extends [true]
	? IfTrue
	: [TrueOrFalse] extends [false]
		? IfFalse
		: IfNeither;

export type RenameProperties<T, NewNames extends Partial<Record<keyof T, string>>> = Expand<{
	[K in keyof T as K extends keyof NewNames
		? NewNames[K] extends PropertyKey
			? NewNames[K]
			: K
		: K]: T[K];
}>;

export type NonEmptyArray<T> = [T, ...T[]];
