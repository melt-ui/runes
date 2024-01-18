const MELT_CONTROLLED_SYMBOL = Symbol("MELT_CONTROLLED_SYMBOL");

export type ControlledArgs<T> = {
	get: () => T;
	set: (value: T) => void;
};

export type ControlledProp<T> = ControlledArgs<T> & {
	[MELT_CONTROLLED_SYMBOL]: true;
};

export function controlled<T>(args: ControlledArgs<T>): ControlledProp<T> {
	return Object.assign(args, { [MELT_CONTROLLED_SYMBOL]: true } as const);
}

export type ControllableProp<T> = T | ControlledProp<T>;

export function isControlledProp<T>(value: ControllableProp<T>): value is ControlledProp<T> {
	return typeof value === "object" && value !== null && MELT_CONTROLLED_SYMBOL in value;
}

export class Syncable<T> {
	#prop = $state() as ControllableProp<T>;

	constructor(prop: ControllableProp<T>) {
		this.#prop = prop;
	}

	get(): T {
		const prop = this.#prop;
		return isControlledProp(prop) ? prop.get() : prop;
	}

	set(value: T): void {
		if (isControlledProp(this.#prop)) {
			this.#prop.set(value);
		} else {
			this.#prop = value;
		}
	}
}
