import type { HTMLAttributes } from "svelte/elements";
import type { Getter, Prettify } from "../types.js";

export type HTMLElementProps = HTMLAttributes<HTMLElement>;

export type HTMLElementEventName = keyof HTMLElementEventMap;

export type HTMLElementEvent<EventName extends HTMLElementEventName> =
	HTMLElementEventMap[EventName] & {
		currentTarget: HTMLElement;
	};

export type ElementArgs<Props extends HTMLElementProps, EventName extends HTMLElementEventName> = {
	props?: {
		[K in keyof Props]: Props[K] | Getter<Props[K]>;
	};
	on?: {
		[E in EventName]: (event: HTMLElementEvent<E>) => void;
	};
};

export function element<
	const Name extends string,
	const Props extends HTMLElementProps = Record<never, never>,
	const EventName extends HTMLElementEventName = never,
>(name: Name, args?: ElementArgs<Props, EventName>): Element<Name, Props, EventName>;

export function element(
	name: string,
	{ props, on }: ElementArgs<HTMLElementProps, HTMLElementEventName> = {},
) {
	const result = {};

	Object.defineProperty(result, dataMelt(name), {
		value: "",
		enumerable: true,
	});

	for (const key in props) {
		const value = props[key as keyof typeof props];
		if (typeof value === "function") {
			Object.defineProperty(result, key, {
				get: value,
				enumerable: true,
			});
		} else {
			Object.defineProperty(result, key, {
				value,
				enumerable: true,
			});
		}
	}

	for (const key in on) {
		Object.defineProperty(result, `on${key}`, {
			value: on[key as keyof typeof on],
			enumerable: true,
		});
	}

	return result;
}

export type Element<
	Name extends string,
	Props extends HTMLElementProps,
	EventName extends HTMLElementEventName,
> = Prettify<Readonly<DataMeltProp<Name> & Props & EventHandlerProps<EventName>>>;

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
