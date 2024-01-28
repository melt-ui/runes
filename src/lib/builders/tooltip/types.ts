import type { FloatingConfig } from "$lib/internal/actions";
import type { ReadBoxOr, WriteBoxOr } from "$lib/internal/helpers";

export type TooltipProps = {
	open?: WriteBoxOr<boolean>;

	positioning?: ReadBoxOr<FloatingConfig>;

	arrowSize?: ReadBoxOr<number>;

	openDelay?: ReadBoxOr<number>;

	closeDelay?: ReadBoxOr<number>;

	closeOnPointerDown?: ReadBoxOr<boolean>;

	closeOnEscape?: ReadBoxOr<boolean>;

	forceVisible?: ReadBoxOr<boolean>;

	disableHoverableContent?: ReadBoxOr<boolean>;

	/**
	 * If set to `true`, whenever you open this tooltip, all other tooltips
	 * with `group` also set to `true` will close. If you pass in a string
	 * instead, only tooltips with the same `group` value will be closed.
	 */
	group?: ReadBoxOr<boolean | string | undefined>;

	/**
	 *
	 * If not undefined, the tooltip will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: ReadBoxOr<HTMLElement | string | null>;

	/**
	 * Optionally override the default ids we assign to the trigger element.
	 */
	triggerId?: ReadBoxOr<string>;

	/**
	 * Optionally override the default ids we assign to the content element.
	 */
	contentId?: ReadBoxOr<string>;
};
