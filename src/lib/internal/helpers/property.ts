import type { Prettify } from "../types";

export type Properties = {
	[key: string]: (() => unknown) | unknown;
};

export type ExtractPropertyValues<T extends Properties> = {
	readonly [K in keyof T]: T[K] extends () => infer V ? V : T[K];
};

export function defineProperties<O, P extends Properties>(
	obj: O,
	properties: P,
): asserts obj is O & Prettify<ExtractPropertyValues<P>> {
	for (const [key, value] of Object.entries(properties)) {
		if (typeof value === "function") {
			Object.defineProperty(obj, key, {
				get: value as () => unknown,
				enumerable: true,
			});
		} else {
			Object.defineProperty(obj, key, {
				value,
				enumerable: true,
			});
		}
	}
}
