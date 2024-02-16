import type { HTMLAttributes } from "svelte/elements";
import type { Prettify } from "../types.js";

export function element<
	const TName extends string,
	const TProps extends HTMLAttributes<HTMLElement> = Record<never, never>,
>(name: TName, props: TProps = {} as TProps) {
	Object.defineProperty(props, `data-melt-${name}`, {
		value: "",
		enumerable: true,
	});
	return props as Element<TName, TProps>;
}

export type Element<TName extends string, TProps extends HTMLAttributes<HTMLElement>> = Prettify<
	{
		readonly [K in `data-melt-${TName}`]: "";
	} & {
		readonly [K in keyof TProps]: TProps[K];
	}
>;
