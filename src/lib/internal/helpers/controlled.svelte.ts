// Ideally, this would be an interface, but abstract classes
// allow for `instaceof` runtime checking.
abstract class State<T> {
	abstract value: T;
}

// A wrapper around `$state` with reference semantics.
// This is the runes equivalent to "pass your own store".
export class ControlledState<T> extends State<T> {
	#value = $state() as T;

	constructor(initialValue: T) {
		super();
		this.#value = initialValue;
	}

	get value(): T {
		return this.#value;
	}

	set value(value: T) {
		this.#value = value;
	}
}

export type RefArgs<T> = {
	get(): T;
	set(value: T): void;
};

// I called this `Ref` because it *references* external state, but
// it could be confusing for devs coming from a Vue background.
//
// TODO: come up with a better name
export class Ref<T> extends State<T> {
	#get: () => T;
	#set: (value: T) => void;

	constructor(args: RefArgs<T>) {
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

export type SyncableProp<T> = T | ControlledState<T> | Ref<T>;

// A wrapper around `SyncableProp` that manages the difference
// in implementation for `get` and `set`.
//
// If the user passes in `T`, it sets its own state.
// If they pass in `State<T>`, it calles the `set` method on that state.
export class Syncable<T> {
	#prop = $state() as SyncableProp<T>;

	constructor(prop: SyncableProp<T>) {
		this.#prop = prop;
	}

	get value(): T {
		const prop = this.#prop;
		return prop instanceof State ? prop.value : prop;
	}

	set value(value: T) {
		const prop = this.#prop;
		if (prop instanceof State) {
			prop.value = value;
		} else {
			this.#prop = value;
		}
	}
}
