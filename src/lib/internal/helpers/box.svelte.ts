/* eslint-disable @typescript-eslint/no-explicit-any */
type Getter<T> = () => T;
type Setter<T> = (value: T) => void;

export type Read<T> = [Getter<T>];
export type Write<T> = [Getter<T>, Setter<T>];

abstract class BaseBox<T> {
	protected readonly getter: Getter<T>;

	constructor(getter: Getter<T>) {
		this.getter = getter;
	}

	abstract get value(): T;
}

class ReadBox<T> extends BaseBox<T> {
	get value(): T {
		return this.getter();
	}
}

class WriteBox<T> extends BaseBox<T> {
	private readonly setter: Setter<T>;

	constructor(getter: Getter<T>, setter: Setter<T>) {
		super(getter);
		this.setter = setter;
	}

	get value(): T {
		return this.getter();
	}

	set value(v: T) {
		this.setter(v);
	}
}

export function box<T>(getter: Getter<T>): ReadBox<T>;
export function box<T>(getter: Getter<T>, setter: Setter<T>): WriteBox<T>;
export function box(getter: any, setter?: any) {
	if (setter) {
		return new WriteBox(getter, setter);
	} else {
		return new ReadBox(getter);
	}
}

function boxFrom<T>(value: BoxOr<Write<T>>): Box<Write<T>>;
function boxFrom<T>(value: Box<Write<T>>): Box<Write<T>>;
function boxFrom<T>(value: BoxOr<Read<T>>): Box<Read<T>>;
function boxFrom<T>(value: Box<Read<T>>): Box<Read<T>>;
function boxFrom<T>(value: T): Box<Write<T>>;
function boxFrom(value: unknown): unknown {
	if (value instanceof BaseBox) {
		return value;
	}
	let v = $state(value);

	return box(
		() => v,
		(value) => (v = value),
	);
}

box.from = boxFrom;

export type Box<T extends Read<any> | Write<any>> = T extends Read<infer U>
	? ReadBox<U>
	: T extends Write<infer U>
		? WriteBox<U>
		: never;

/* Utility functions and types */
export type BoxOr<T extends Read<any> | Write<any>> = T extends Read<infer U>
	? Box<Read<U>> | U
	: T extends Write<infer U>
		? Box<Write<U>> | U
		: never;

type CorrectBool<T> = T extends true | false ? boolean : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BoxFrom<T extends BoxOr<any>> = T extends Box<Write<infer U>>
	? Box<Write<U>>
	: T extends Box<Read<infer U>>
		? Box<Read<U>>
		: Box<Write<CorrectBool<T>>>;
