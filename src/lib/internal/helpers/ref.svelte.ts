export abstract class ReadableRef<T> {
	abstract get value(): T;

	get(): T {
		return this.value;
	}
}

export abstract class WritableRef<T> extends ReadableRef<T> {
	abstract set value(value: T);

	set(value: T): void {
		this.value = value;
	}
}

class StateRef<T> extends WritableRef<T> {
	value = $state() as T;

	constructor(initialValue: T) {
		super();
		this.value = initialValue;
	}
}

export function ref<T>(initialValue: T): WritableRef<T> {
	return new StateRef(initialValue);
}

export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;

/**
 * Readonly wrapper around external state.
 */
class DerivedReadableRef<T> extends ReadableRef<T> {
	constructor(readonly get: Getter<T>) {
		super();
	}

	get value() {
		return this.get();
	}
}

/**
 * Writable wrapper around external state.
 */
class DerivedWritableRef<T> extends WritableRef<T> {
	constructor(
		readonly get: Getter<T>,
		readonly set: Setter<T>,
	) {
		super();
	}

	get value() {
		return this.get();
	}

	set value(value: T) {
		this.set(value);
	}
}

export type GetSet<T> = {
	get: Getter<T>;
	set: Setter<T>;
};

export function derivedRef<T>(getter: Getter<T>): ReadableRef<T>;

export function derivedRef<T>(args: GetSet<T>): WritableRef<T>;

export function derivedRef<T>(args: Getter<T> | GetSet<T>): ReadableRef<T> {
	if (typeof args === "function") {
		return new DerivedReadableRef(args);
	}
	return new DerivedWritableRef(args.get.bind(args), args.set.bind(args));
}

export type ReadableProp<T> = T | ReadableRef<T>;

export function toReadableRef<T>(value: ReadableProp<T>): ReadableRef<T> {
	if (value instanceof ReadableRef) {
		return value;
	}
	return new ConstRef(value);
}

class ConstRef<T> extends ReadableRef<T> {
	constructor(readonly value: T) {
		super();
	}
}

export type WritableProp<T> = T | WritableRef<T>;

export function toWritableRef<T>(value: WritableProp<T>): WritableRef<T> {
	if (value instanceof WritableRef) {
		return value;
	}
	return new StateRef(value);
}
