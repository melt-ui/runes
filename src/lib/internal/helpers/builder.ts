import type { Action } from "svelte/action";
import type { Prettify } from "../types";

export type BuilderArgs<
	TProps extends Record<string, unknown>,
	TGetters extends Record<string, () => unknown>,
	TAction extends Action,
> = {
	props?: TProps;
	getters?: TGetters;
	action?: TAction;
};

export function builder<
	const TName extends string,
	const TProps extends Record<string, unknown> = Record<never, never>,
	const TGetters extends Record<string, () => unknown> = Record<never, never>,
	const TAction extends Action = Action,
>(name: TName, args: BuilderArgs<TProps, TGetters, TAction> = {}) {
	const { props, getters, action = () => {} } = args;

	Object.defineProperty(action, `data-melt-${name}`, { value: "", enumerable: true });

	for (const key in props) {
		Object.defineProperty(action, key, { value: props[key], enumerable: true });
	}

	for (const key in getters) {
		Object.defineProperty(action, key, { get: getters[key], enumerable: true });
	}

	Object.defineProperty(action, "action", { value: action, enumerable: false });

	return action as TAction & BuilderAttributes<TName, TProps, TGetters, TAction>;
}

export type BuilderAttributes<
	TName extends string,
	TProps extends Record<string, unknown>,
	TGetters extends Record<string, () => unknown>,
	TAction extends Action,
> = Prettify<
	{
		readonly [K in `data-melt-${TName}`]: "";
	} & {
		readonly [K in keyof TProps]: TProps[K];
	} & {
		readonly [K in keyof TGetters]: ReturnType<TGetters[K]>;
	} & {
		readonly action: TAction;
	}
>;
