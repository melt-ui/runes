import type { Action } from "svelte/action";
import type { HTMLAttributes } from "svelte/elements";
import type { Prettify } from "../types";
import { noop } from "./callbacks";

export type BuilderArgs<TProps, TAction> = {
	props?: TProps;
	action?: TAction;
};

export function builder<
	const TName extends string,
	const TProps extends HTMLAttributes<HTMLElement> = Record<never, never>,
	const TAction extends Action<HTMLElement> = () => void,
>(name: TName, args: BuilderArgs<TProps, TAction> = {}) {
	const { props = {}, action = noop } = args;

	Object.defineProperty(props, `data-melt-${name}`, {
		value: "",
		enumerable: true,
	});

	Object.defineProperty(props, "action", {
		value: action,
		enumerable: false,
	});

	return props as Builder<TName, TProps, TAction>;
}

export type Builder<
	TName extends string,
	TProps extends HTMLAttributes<HTMLElement>,
	TAction extends Action<HTMLElement>,
> = Prettify<
	{
		readonly [K in `data-melt-${TName}`]: "";
	} & {
		readonly [K in keyof TProps]: TProps[K];
	} & {
		readonly action: TAction;
	}
>;
