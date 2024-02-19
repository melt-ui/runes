import type { HTMLAttributes } from "svelte/elements";
import type { Getter, Prettify } from "../types.js";

export type HTMLElementProps = HTMLAttributes<HTMLElement>;

export type HTMLElementEventName = keyof HTMLElementEventMap;

export type HTMLElementEvent<EventName extends HTMLElementEventName> =
	HTMLElementEventMap[EventName] & {
		currentTarget: HTMLElement;
	};

export type ElementArgs<
	Props extends HTMLElementProps,
	DerivedProps extends HTMLElementProps,
	EventName extends HTMLElementEventName,
> = {
	props?: {
		[K in keyof Props]: Props[K];
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
	const Props extends HTMLElementProps = Record<never, never>,
	const DerivedProps extends HTMLElementProps = Record<never, never>,
	const EventName extends HTMLElementEventName = never,
>(
	name: Name,
	{ props, derived, on }: ElementArgs<Props, DerivedProps, EventName> = {},
): Element<Name, Props, DerivedProps, EventName> {
	const result = {};

	Object.defineProperty(result, dataMelt(name), {
		value: "",
		enumerable: true,
	});

	for (const key in props) {
		Object.defineProperty(result, key, {
			value: props[key],
			enumerable: true,
		});
	}

	for (const key in derived) {
		Object.defineProperty(result, key, {
			get: derived[key],
			enumerable: true,
		});
	}

	for (const key in on) {
		Object.defineProperty(result, `on${key}`, {
			value: on[key],
			enumerable: true,
		});
	}

	return result as Element<Name, Props, DerivedProps, EventName>;
}

export type Element<
	Name extends string,
	Props extends HTMLElementProps,
	DerviedProps extends HTMLElementProps,
	EventName extends HTMLElementEventName,
> = Prettify<Readonly<DataMeltProp<Name> & Props & DerviedProps & EventHandlerProps<EventName>>>;

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
