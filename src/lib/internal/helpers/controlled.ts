const MELT_CONTROLLED_SYMBOL = Symbol("MELT_CONTROLLED_SYMBOL");

export type ControlledArgs<T> = {
	get: () => T;
	set: (value: T) => void;
};

export type ControlledProp<T> = ControlledArgs<T> & {
	[MELT_CONTROLLED_SYMBOL]: true;
};

export function controlled<T>(value: ControlledArgs<T>): ControlledProp<T> {
	return Object.assign(value, { [MELT_CONTROLLED_SYMBOL]: true } as const);
}

export function isControlledProp<T>(value: SyncableProp<T>): value is ControlledProp<T> {
	return typeof value === "object" && value !== null && MELT_CONTROLLED_SYMBOL in value;
}

export type SyncableProp<T> = T | ControlledProp<T>;

export class Prop<T> {
	#prop: SyncableProp<T>;

	constructor(prop: SyncableProp<T>) {
		this.#prop = prop;
	}

	get(): T {
		return isControlledProp(this.#prop) ? this.#prop.get() : this.#prop;
	}

	set(value: T): void {
		if (isControlledProp(this.#prop)) {
			this.#prop.set(value);
		} else {
			this.#prop = value;
		}
	}
}
