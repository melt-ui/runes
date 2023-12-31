import type { FloatingConfig } from "$lib/internal/actions";
import type { IdObj } from "$lib/internal/helpers";

export type TooltipProps = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	open?: boolean;
	closeOnPointerDown?: boolean;
	openDelay?: number;
	closeDelay?: number;
	forceVisible?: boolean;
	closeOnEscape?: boolean;
	disableHoverableContent?: boolean;

	/**
	 * If not undefined, the tooltip will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;

	/**
	 * If set to `true` or a string, whenever you open this tooltip,
	 * all other tooltips with the same `group` value will be closed.
	 */
	group?: boolean | string | null;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<TooltipIds>;
};

export type TooltipIds = IdObj<"trigger" | "content">;
