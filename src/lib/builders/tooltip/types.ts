import type { FloatingConfig } from "$lib/internal/actions";
import type { IdObj } from "$lib/internal/helpers";
import type { ChangeFn } from "$lib/internal/types";

export type TooltipProps = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	open?: boolean;
	onOpenChange?: ChangeFn<boolean>;
	closeOnPointerDown?: boolean;
	openDelay?: number;
	closeDelay?: number;
	forceVisible?: boolean;
	closeOnEscape?: boolean;
	disableHoverableContent?: boolean;

	/**
	 * If set to `true`, whenever you open this tooltip, all other tooltips
	 * with `group` also set to `true` will close. If you pass in a string
	 * instead, only tooltips with the same `group` value will be closed.
	 */
	group?: boolean | string;

	/**
	 *
	 * If not undefined, the tooltip will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<TooltipIdParts>>;
};

export type TooltipIdParts = "trigger" | "content";
