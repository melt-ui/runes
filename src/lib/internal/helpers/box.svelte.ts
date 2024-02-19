export type ReadableBox<T> = { readonly value: T };
export type WritableBox<T> = { value: T };

export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;

export class DerivedBox<T> implements ReadableBox<T> {
	constructor(
		private readonly get: Getter<T>,
		private readonly set?: Setter<T>,
	) {}

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
	wrapDefaultWithState?: boolean;
};

export function readableBox<T>(
	value: ReadableProp<T>,
	{ wrapDefaultWithState }: ReadableBoxConfig = {},
): ReadableBox<T> {
	if (typeof value === "function") {
		return new DerivedBox(value as Getter<T>);
	}
	if (wrapDefaultWithState) {
		return stateBox(value);
	}
	return { value };
}

export function stateBox<T>(value: T): WritableBox<T> {
	const boxed = $state({ value });
	return boxed;
}

export function writableBox<T>(value: WritableProp<T>): WritableBox<T> {
	if (value !== null && typeof value === "object" && "get" in value && "set" in value) {
		return new DerivedBox(value.get.bind(value), value.set.bind(value));
	}
	return stateBox(value);
}
