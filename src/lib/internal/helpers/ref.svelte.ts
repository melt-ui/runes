// Ideally, this would be an interface, but abstract classes
// allow for `instanceof` runtime checking.
abstract class BaseRef<T> {
	abstract value: T;
}

// A wrapper around `$state` with reference semantics.
// This is the runes equivalent to "pass your own store".
export class Ref<T> extends BaseRef<T> {
	value = $state() as T;

	constructor(initialValue: T) {
		super();
		this.value = initialValue;
	}
}

export type DerivedRefArgs<T> = {
	get(): T;
	set(value: T): void;
};

export class DerivedRef<T> extends BaseRef<T> {
	#get: () => T;
	#set: (value: T) => void;

	constructor(args: DerivedRefArgs<T>) {
		super();
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

export type RefOr<T> = T | Ref<T> | DerivedRef<T>;

// A wrapper around `RefOr<T>` that manages the
// difference in implementation for `get` and `set`.
//
// If the user passes in `T`, it sets its own state.
// If they pass in `BaseRef<T>`, it calles the `set` method.
export class ControllableProp<T> {
	#prop = $state() as RefOr<T>;

	constructor(prop: RefOr<T>) {
		this.#prop = prop;
	}

	get value(): T {
		const prop = this.#prop;
		return prop instanceof BaseRef ? prop.value : prop;
	}

	set value(value: T) {
		const prop = this.#prop;
		if (prop instanceof BaseRef) {
			prop.value = value;
		} else {
			this.#prop = value;
		}
	}
}
