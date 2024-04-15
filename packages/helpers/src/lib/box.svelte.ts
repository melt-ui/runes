export type ReadableBox<T> = { readonly value: T };
export type WritableBox<T> = { value: T };

export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;

export class DerivedBox<T> implements ReadableBox<T> {
	constructor(
		private readonly get: Getter<T>,
		private readonly set?: Setter<T>,
	) { }

	get value() {
		return this.get();
	}

	set value(v) {
		if (this.set === undefined) {
			throw new Error("Cannot set readonly value");
		}
		this.set(v);
	}
}

export type ReadableProp<T> = T | Getter<T>;
export type WritableProp<T> = T | { get: Getter<T>; set: Setter<T> };

export type ReadableBoxConfig = {
	proxy?: boolean;
};

export function readableBox<T>(
	value: ReadableProp<T>,
	{ proxy = false }: ReadableBoxConfig = {},
): ReadableBox<T> {
	if (typeof value === "function") {
		return new DerivedBox(value as Getter<T>);
	}

	if (proxy) {
		const boxed = $state({ value });
		return boxed;
	}

	return { value };
}

export function writableBox<T>(value: WritableProp<T>): WritableBox<T> {
	if (value !== null && typeof value === "object" && "get" in value && "set" in value) {
		return new DerivedBox(value.get.bind(value), value.set.bind(value));
	}
	const boxed = $state({ value });
	return boxed;
}

export function toBoxes<
	Readables extends Record<string, ReadableProp<unknown>>,
	Writables extends Record<string, WritableProp<unknown>>,
>(
	{ readables, writables }: { readables: Readables; writables: Writables },
): {
	[K in keyof Readables]: Readables[K] extends ReadableProp<infer T> ? ReadableBox<T> : never;
} & {
	[K in keyof Writables]: Writables[K] extends WritableProp<infer T> ? WritableBox<T> : never;
} {
	const readableEntries = Object.entries(readables) as [keyof Readables, ReadableProp<unknown>][];
	const writableEntries = Object.entries(writables) as [keyof Writables, WritableProp<unknown>][];
	const readableBoxes = Object.fromEntries(
		readableEntries.map(([key, value]) => [key, readableBox(value)]),
	);
	const writableBoxes = Object.fromEntries(
		writableEntries.map(([key, value]) => [key, writableBox(value)]),
	);
	// eslint-disable-next-line ts/no-explicit-any
	return { ...readableBoxes, ...writableBoxes } as any;
}

// Given an object that possibly contains boxes, return a proxy that
// gets the current value of the box when accessed, and sets the value
// of the box when assigned to.
export function pack<T extends Record<string, unknown>>(
	obj: T,
):
	ReadonlyObj<ExcludeValues<{
		[K in keyof T]: IsReadableBox<T[K]> extends true ? T[K] extends ReadableBox<infer U> ? U : never : never
	}, never>>
	& ExcludeValues<{
		[K in keyof T]: IsWritableBox<T[K]> extends true ? T[K] extends ReadableBox<infer U> ? U : never : never
	}, never>
	& ExcludeValues<{
		[K in keyof T]: T[K] extends ReadableBox<infer _> ? never : T[K] extends WritableBox<infer _> ? never : T[K]
	}, never> {
	const keys = Object.keys(obj) as (keyof T)[];
	const result = {} as Record<string, unknown>;
	for (const key of keys) {
		// eslint-disable-next-line ts/no-explicit-any
		const value = obj[key] as any;
		if ("value" in value) {
			Object.defineProperty(result, key, {
				get() {
					return value.value;
				},
				set(v: unknown) {
					value.value = v;
				},
			});
		} else {
			// eslint-disable-next-line ts/no-explicit-any
			result[key as any] = value as any;
		}
	}
	// eslint-disable-next-line ts/no-explicit-any
	return result as any;
}

type ExcludeKeys<O, ToExclude> = {
	[K in keyof O]: O[K] extends ToExclude ? never : K
}[keyof O];

type ExcludeValues<O, ToExclude> = {
	[K in ExcludeKeys<O, ToExclude>]: O[K]
};

type IfEquals<X, Y, A = X, B = never> =
	(<T>() => T extends X ? 1 : 2) extends
	(<T>() => T extends Y ? 1 : 2) ? A : B;

type IsReadableBox<Box> = Box extends ReadableBox<infer T> ? IfEquals<Box, ReadableBox<T>, true, false> : false;
type IsWritableBox<Box> = Box extends WritableBox<infer T> ? IfEquals<Box, WritableBox<T>, true, false> : false;

type ReadonlyObj<O> = {
	readonly [K in keyof O]: O[K]
};
