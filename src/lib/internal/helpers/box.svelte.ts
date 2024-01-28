export abstract class ReadBox<T> {
	abstract readonly value: T;

	get(): T {
		return this.value;
	}
}

export abstract class WriteBox<T> extends ReadBox<T> {
	abstract value: T;

	set(value: T) {
		this.value = value;
	}
}

class StateBox<T> extends WriteBox<T> {
	value = $state() as T;

	constructor(initialValue: T) {
		super();
		this.value = initialValue;
	}
}

export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;

class DerivedReadBox<T> extends ReadBox<T> {
	constructor(readonly get: Getter<T>) {
		super();
	}

	get value(): T {
		return this.get();
	}
}

class DerivedWriteBox<T> extends WriteBox<T> {
	constructor(
		readonly get: Getter<T>,
		readonly set: Setter<T>,
	) {
		super();
	}

	get value(): T {
		return this.get();
	}

	set value(v: T) {
		this.set(v);
	}
}

export function box<T>(getter: Getter<T>): ReadBox<T>;
export function box<T>(getter: Getter<T>, setter: Setter<T>): WriteBox<T>;

export function box<T>(getter: Getter<T>, setter?: Setter<T>) {
	if (setter) {
		return new DerivedWriteBox(getter, setter);
	} else {
		return new DerivedReadBox(getter);
	}
}

export type ReadBoxOr<T> = ReadBox<T> | T;
export type WriteBoxOr<T> = WriteBox<T> | T;

function boxFrom<T>(value: WriteBoxOr<T>): WriteBox<T>;
function boxFrom<T>(value: ReadBoxOr<T>): ReadBox<T>;
function boxFrom<T>(value: T): WriteBox<T>;

function boxFrom<T>(value: T | ReadBox<T>) {
	if (value instanceof ReadBox) {
		return value;
	} else {
		return new StateBox(value);
	}
}

box.from = boxFrom;

// export type Box<T extends Read<any> | Write<any>> = T extends Read<infer U>
// 	? ReadBox<U>
// 	: T extends Write<infer U>
// 		? WriteBox<U>
// 		: never;

// /* Utility functions and types */
// export type Read<T> = [Getter<T>];
// export type Write<T> = [Getter<T>, Setter<T>];

// export type BoxOr<T extends Read<any> | Write<any>> = T extends Read<infer U>
// 	? Box<Read<U>> | U
// 	: T extends Write<infer U>
// 		? Box<Write<U>> | U
// 		: never;

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type BoxFrom<T extends BoxOr<any>> = T extends Box<Write<infer U>>
// 	? Box<Write<U>>
// 	: T extends Box<Read<infer U>>
// 		? Box<Read<U>>
// 		: Box<Write<T>>;
