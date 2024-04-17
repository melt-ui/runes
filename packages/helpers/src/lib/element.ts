import type { HTMLAttributes } from "svelte/elements";
import type { Prettify } from "./types.js";
import { isFunction } from "./is.js";

export type HTMLElementAttributes = HTMLAttributes<HTMLElement>;

export type HTMLElementEvent<TEvent extends Event = Event> = TEvent & {
	currentTarget: HTMLElement;
};

export function element<const TName extends string, const TProps extends HTMLElementAttributes>(
	name: TName,
	props: TProps | (() => TProps),
): Element<TName, TProps>;

export function element(name: string, props: HTMLElementAttributes | (() => HTMLElementAttributes)) {
	const returned = isFunction(props) ? props() : props;
	returned[`data-melt-${name}`] = "";
	return returned;
}

export type Element<TName extends string, TProps extends HTMLElementAttributes> = Prettify<
	Readonly<DataMeltProp<TName> & TProps>
>;

export type DataMeltProp<TName extends string> = {
	[N in TName]: Record<`data-melt-${N}`, "">;
}[TName];

export function dataMeltSelector<TName extends string>(name: TName) {
	return `[data-melt-${name}]` as const;
}
