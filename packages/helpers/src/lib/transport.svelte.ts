import { isFunction } from "./is.js";
import { keys } from "./object.js";
import { capitalize } from "./string.js";

const transportSymbol = Symbol("transport");

/**
 * Packs the contents of a getter into a transport object.
 *
 * WARNING: if returning an object, the keys must be consistent.
 */
export function transport<G>(get: () => G) {
	return {
		get value() {
			return get();
		},
		[transportSymbol]: true,
	};
}

type Transported<T> = ReturnType<typeof transport<T>>;

export type MaybeTransported<T> = T | Transported<T>;

function isTransported(value: unknown): value is Transported<unknown> {
	return typeof value === "object" && value !== null && transportSymbol in value;
}

export function receive<T>(value: T | Transported<T>): Transported<T> {
	return isTransported(value) ? value : { value, [transportSymbol]: true };
}

// type that checks if a certain key is present in an object
type HasKey<O, K extends string> = K extends keyof O ? true : false;

// type that gets all keys that have setter keys
type SetKeys<O> = {
	[K in keyof O]: HasKey<O, `set${Capitalize<string & K>}`> extends true ? K : never
}[keyof O];

// type that gets all setter keys
type SetterKeys<O> = {
	[K in keyof O]: HasKey<O, `set${Capitalize<string & K>}`> extends true ? `set${Capitalize<string & K>}` : never
}[keyof O];

// type that gets all getter keys
type GetterKeys<O> = Exclude<keyof O, SetKeys<O> | SetterKeys<O>>;

type ReceivedObj<O extends Record<string, unknown>> =
	{
		readonly [K in GetterKeys<O>]: O[K]
	} & {
		[K in SetKeys<O>]: O[K]
	};

// type O = { pressed: boolean; setPressed: (value: boolean) => void; disabled: boolean };
// type S = SetKeys<O>; // "pressed"
// type ST = SetterKeys<O>; // "setPressed"
// type G = GetterKeys<O>; // "disabled"
// type A = ReceivedObj<O>; // { pressed: boolean; readonly disabled: boolean; }

export function receiveObj<O extends Record<string, unknown>, D extends Partial<O>>(
	value: MaybeTransported<O>,
	// eslint-disable-next-line ts/no-explicit-any
	defaults: D = {} as any,
) {
	const received = receive(value);

	const allKeys = keys({ ...received.value, ...defaults });
	const getterKeys = allKeys.filter((k) => !k.startsWith("set"));

	const result = {};

	getterKeys.forEach((k) => {
		if (k in received.value) {
			const derived = $derived(received.value[k]);
			const setter = received.value[`set${capitalize(k)}`];

			Object.defineProperty(result, k, {
				get() {
					return derived;
				},
				set(value) {
					isFunction(setter)
					&& setter?.(value);
				},
			});
		} else {
			let state = $state(defaults[k]);

			Object.defineProperty(result, k, {
				get() {
					return state;
				},
				set(value) {
					state = value;
				},
			});
		}
	});

	return result as ReceivedObj<O & D>;
}
