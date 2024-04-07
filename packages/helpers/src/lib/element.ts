import type { HTMLAttributes } from "svelte/elements";
import type { Prettify } from "./types.js";

export type HTMLElementAttributes = HTMLAttributes<HTMLElement>;

export type HTMLElementEvent<TEvent extends Event = Event> = TEvent & {
	currentTarget: HTMLElement;
};

export function element<const TName extends string, const TProps extends HTMLElementAttributes>(
	name: TName,
	props: TProps,
): Element<TName, TProps>;

export function element(name: string, props: HTMLElementAttributes) {
	props[`data-melt-${name}`] = "";
	return props;
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
