import type { Prettify } from "../types";

export type PropertyDescriptors = {
	[key: string]:
		| { value: unknown; enumerable?: boolean }
		| { get: () => unknown; enumerable?: boolean };
};

type ExtractProperties<D extends PropertyDescriptors> = {
	[K in keyof D]: D[K] extends { value: infer V }
		? V
		: D[K] extends { get: () => infer V }
			? V
			: never;
};

export function defineProperties<O, const D extends PropertyDescriptors>(
	obj: O,
	descriptors: D,
): asserts obj is O & Prettify<ExtractProperties<D>> {
	for (const [key, descriptor] of Object.entries(descriptors)) {
		if ("value" in descriptor) {
			const { value, enumerable = true } = descriptor;
			Object.defineProperty(obj, key, { value, enumerable });
		} else if ("get" in descriptor) {
			const { get, enumerable = true } = descriptor;
			Object.defineProperty(obj, key, { get, enumerable });
		}
	}
}
