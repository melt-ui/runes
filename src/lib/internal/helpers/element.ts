import type { HTMLAttributes } from "svelte/elements";
import type { Getter, Prettify } from "../types.js";

export type HTMLElementProps = HTMLAttributes<HTMLElement>;

export type HTMLElementEventName = keyof HTMLElementEventMap;

export type HTMLElementEvent<EventName extends HTMLElementEventName> =
	HTMLElementEventMap[EventName] & {
		currentTarget: HTMLElement;
	};

export type ElementProps<
	StaticProps extends HTMLElementProps,
	DerivedProps extends HTMLElementProps,
	EventName extends HTMLElementEventName,
> = {
	static?: {
		[K in keyof StaticProps]: StaticProps[K];
	};
	derived?: {
		[K in keyof DerivedProps]: Getter<DerivedProps[K]>;
	};
	on?: {
		[E in EventName]: (event: HTMLElementEvent<E>) => void;
	};
};

export function element<
	const Name extends string,
	const StaticProps extends HTMLElementProps = Record<never, never>,
	const DerivedProps extends HTMLElementProps = Record<never, never>,
	const EventName extends HTMLElementEventName = never,
>(
	name: Name,
	props: ElementProps<StaticProps, DerivedProps, EventName> = {},
): Element<Name, StaticProps, DerivedProps, EventName> {
	const result = {};

	Object.defineProperty(result, dataMelt(name), {
		value: "",
		enumerable: true,
	});

	for (const key in props.static) {
		Object.defineProperty(result, key, {
			value: props.static[key],
			enumerable: true,
		});
	}

	for (const key in props.derived) {
		Object.defineProperty(result, key, {
			get: props.derived[key],
			enumerable: true,
		});
	}

	for (const key in props.on) {
		Object.defineProperty(result, `on${key}`, {
			value: props.on[key],
			enumerable: true,
		});
	}

	return result as Element<Name, StaticProps, DerivedProps, EventName>;
}

export type Element<
	Name extends string,
	StaticProps extends HTMLElementProps,
	DerivedProps extends HTMLElementProps,
	EventName extends HTMLElementEventName,
> = Prettify<
	Readonly<DataMeltProp<Name> & StaticProps & DerivedProps & EventHandlerProps<EventName>>
>;

type DataMeltProp<Name extends string> = {
	[N in Name]: Record<`data-melt-${N}`, "">;
}[Name];

type EventHandlerProps<EventName extends HTMLElementEventName> = {
	[E in EventName as `on${E}`]: (event: HTMLElementEvent<E>) => void;
};

export function dataMelt<const Name extends string>(name: Name) {
	return `data-melt-${name}` as const;
}

export function dataMeltSelector<const Name extends string>(name: Name) {
	return `[data-melt-${name}]` as const;
}
