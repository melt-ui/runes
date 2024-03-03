import type { HTMLAttributes } from "svelte/elements";
import type { Prettify } from "../types.js";

export function element<
	const Name extends string,
	const Props extends HTMLAttributes<HTMLElement> = Record<never, never>,
>(name: Name, props?: Props): Element<Name, Props>;

export function element(name: string, props: HTMLAttributes<HTMLElement> = {}) {
	props[`data-melt-${name}`] = "";
	return props;
}

export type DataMeltProp<Name extends string> = {
	[K in Name]: Record<`data-melt-${K}`, "">;
}[Name];

export type Element<Name extends string, Props extends HTMLAttributes<HTMLElement>> = Prettify<
	Readonly<DataMeltProp<Name> & Props>
>;
