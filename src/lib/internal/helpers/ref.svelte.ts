
export type RefOr<T> = T | Ref<T>;

export abstract class Ref<T> {
	abstract readonly value: T;

	get(): T {
		return this.value;
	}

	static from<T>(value: RefOr<T>): Ref<T> {
		if (value instanceof Ref) {
			return value;
		}
		return new ConstRef(value);
	}
}

export class ConstRef<T> extends Ref<T> {
	constructor(readonly value: T) {
		super();
	}
}

export type MutableRefOr<T> = T | MutableRef<T>;

export abstract class MutableRef<T> extends Ref<T> {
	abstract value: T;

	set(value: T): void {
		this.value = value;
	}

	static from<T>(value: MutableRefOr<T>): MutableRef<T> {
		if (value instanceof Ref) {
			return value;
		}
		return new State(value);
	}
}

export class State<T> extends MutableRef<T> {
	value = $state() as T;

	constructor(initialValue: T) {
		super();
		this.value = initialValue;
	}
}

export class Derived<T> extends Ref<T> {
	constructor(readonly get: () => T) {
		super();
	}

	get value(): T {
		return this.get();
	}
}

export type MutableDerivedArgs<T> = {
	get: () => T;
	set: (value: T) => void;
};

export class MutableDerived<T> extends MutableRef<T> {
	readonly get: () => T;
	readonly set: (value: T) => void;

	constructor(readonly args: MutableDerivedArgs<T>) {
		super();
		this.get = args.get.bind(args);
		this.set = args.set.bind(args);
	}

	get value(): T {
		return this.args.get();
	}

	set value(value: T) {
		this.args.set(value);
	}
}
