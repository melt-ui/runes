// A wrapper around `$state` with reference semantics.
// This is the runes equivalent to "pass your own store".
export class Ref<T> {
	value = $state() as T;

	constructor(initialValue: T) {
		this.value = initialValue;
	}
}

export type DerivedRefArgs<T> = {
	get(): T;
	set(value: T): void;
};

export class DerivedRef<T> {
	#get: () => T;
	#set: (value: T) => void;

	constructor(args: DerivedRefArgs<T>) {
		this.#get = args.get.bind(args);
		this.#set = args.set.bind(args);
	}

	get value(): T {
		return this.#get();
	}

	set value(value: T) {
		this.#set(value);
	}
}

export type SomeRef<T> = Ref<T> | DerivedRef<T>;

export type RefOr<T> = T | SomeRef<T>;

export function isRef<T>(value: RefOr<T>): value is SomeRef<T> {
	return value instanceof Ref || value instanceof DerivedRef;
}

export function ref<T>(value: RefOr<T>): SomeRef<T> {
	return isRef(value) ? value : new Ref(value);
}
