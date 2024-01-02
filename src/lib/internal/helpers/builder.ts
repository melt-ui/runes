import type { Action } from "svelte/action";
import type { Prettify } from "../types";

export type BuilderProps = {
	[key: string]: { value: unknown } | { get: () => unknown };
};

export type BuilderArgs<TProps extends BuilderProps, TAction extends Action> = {
	props?: TProps;
	action?: TAction;
};

export function builder<
	TName extends string,
	TProps extends BuilderProps = Record<never, never>,
	TAction extends Action = Action,
>(name: TName, args: BuilderArgs<TProps, TAction> = {}) {
	const { props, action = () => {} } = args;

	Object.defineProperty(action, `data-melt-${name}`, { value: "", enumerable: true });
	Object.defineProperty(action, "action", { value: action, enumerable: false });

	for (const key in props) {
		const prop = props[key];
		if ("value" in prop) {
			Object.defineProperty(action, key, { value: prop.value, enumerable: true });
		} else if ("get" in prop) {
			Object.defineProperty(action, key, { get: prop.get, enumerable: true });
		}
	}

	return action as TAction & BuilderAttributes<TName, TProps, TAction>;
}

export type BuilderAttributes<
	TName extends string,
	TProps extends BuilderProps,
	TAction extends Action,
> = Prettify<
	{
		readonly [K in `data-melt-${TName}`]: "";
	} & {
		readonly action: TAction;
	} & {
		readonly [K in keyof TProps]: TProps[K] extends { value: infer V }
			? V
			: TProps[K] extends { get: () => infer V }
				? V
				: never;
	}
>;
