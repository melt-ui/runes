import type { FloatingConfig } from "$lib/internal/actions";
import type { MutableRefOr, RefOr } from "$lib/internal/helpers";

export type TooltipProps = {
	open?: MutableRefOr<boolean>;

	positioning?: RefOr<FloatingConfig>;

	arrowSize?: RefOr<number>;

	openDelay?: RefOr<number>;

	closeDelay?: RefOr<number>;

	closeOnPointerDown?: RefOr<boolean>;

	closeOnEscape?: RefOr<boolean>;

	forceVisible?: RefOr<boolean>;

	disableHoverableContent?: RefOr<boolean>;

	/**
	 * If set to `true`, whenever you open this tooltip, all other tooltips
	 * with `group` also set to `true` will close. If you pass in a string
	 * instead, only tooltips with the same `group` value will be closed.
	 */
	group?: RefOr<boolean | string | undefined>;

	/**
	 *
	 * If not undefined, the tooltip will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: RefOr<HTMLElement | string | null>;

	/**
	 * Optionally override the default ids we assign to the trigger element.
	 */
	triggerId?: RefOr<string>;

	/**
	 * Optionally override the default ids we assign to the content element.
	 */
	contentId?: RefOr<string>;
};
