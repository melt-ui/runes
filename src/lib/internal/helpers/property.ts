import type { Prettify } from "../types";

export type Properties = {
	[key: string]:
		| { value: unknown; enumerable?: boolean }
		| { get: () => unknown; enumerable?: boolean };
};

export type ExtractPropertyValues<T extends Properties> = {
	readonly [K in keyof T]: T[K] extends { value: infer V }
		? V
		: T[K] extends { get: () => infer V }
			? V
			: never;
};

export function defineProperties<O, P extends Properties>(
	obj: O,
	properties: P,
): asserts obj is O & Prettify<ExtractPropertyValues<P>> {
	for (const [key, property] of Object.entries(properties)) {
		if ("value" in property) {
			const { value, enumerable = true } = property;
			Object.defineProperty(obj, key, { value, enumerable });
		} else if ("get" in property) {
			const { get, enumerable = true } = property;
			Object.defineProperty(obj, key, { get, enumerable });
		}
	}
}
