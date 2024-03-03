export type Box<T> = { value: T };
export type ReadonlyBox<T> = Readonly<Box<T>>;

export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;

class DerivedBox<T> implements Box<T> {
	constructor(
		readonly get: Getter<T>,
		readonly set: Setter<T>,
	) {}

	get value() {
		return this.get();
	}

	set value(v) {
		this.set(v);
	}
}

class ReadonlyDerivedBox<T> implements ReadonlyBox<T> {
	constructor(readonly get: Getter<T>) {}

	get value() {
		return this.get();
	}
}

export type ReadableProp<T> = T | Getter<T>;
export type WritableProp<T> = T | { get: Getter<T>; set: Setter<T> };

export function readonlyBox<T>(value: ReadableProp<T>): ReadonlyBox<T> {
	if (typeof value === "function") {
		return new ReadonlyDerivedBox(value as Getter<T>);
	} else {
		return { value };
	}
}

export function box<T>(value: WritableProp<T>): Box<T> {
	if (value !== null && typeof value === "object" && "get" in value && "set" in value) {
		return new DerivedBox(value.get.bind(value), value.set.bind(value));
	} else {
		const boxed = $state({ value });
		return boxed;
	}
}
