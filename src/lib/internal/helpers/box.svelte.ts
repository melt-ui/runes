export type ReadableBox<T> = { readonly value: T };
export type WritableBox<T> = { value: T };

export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;

class DerivedBox<T> implements ReadableBox<T> {
	constructor(
		readonly get: Getter<T>,
		readonly set?: Setter<T>,
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

export function readableBox<T>(value: ReadableProp<T>): ReadableBox<T> {
	if (typeof value === "function") {
		return new DerivedBox(value as Getter<T>);
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
