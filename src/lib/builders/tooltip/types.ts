import type { FloatingConfig } from "$lib/internal/actions";
import type { ReadableProp, WritableProp } from "$lib/internal/helpers";

export type TooltipProps = {
	open?: WritableProp<boolean>;

	positioning?: ReadableProp<FloatingConfig>;

	arrowSize?: ReadableProp<number>;

	openDelay?: ReadableProp<number>;

	closeDelay?: ReadableProp<number>;

	closeOnPointerDown?: ReadableProp<boolean>;

	closeOnEscape?: ReadableProp<boolean>;

	forceVisible?: ReadableProp<boolean>;

	disableHoverableContent?: ReadableProp<boolean>;

	/**
	 * If set to `true`, whenever you open this tooltip, all other tooltips
	 * with `group` also set to `true` will close. If you pass in a string
	 * instead, only tooltips with the same `group` value will be closed.
	 */
	group?: ReadableProp<boolean | string | undefined>;

	/**
	 *
	 * If not undefined, the tooltip will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: ReadableProp<HTMLElement | string | null>;

	/**
	 * Optionally override the default ids we assign to the trigger element.
	 */
	triggerId?: ReadableProp<string>;

	/**
	 * Optionally override the default ids we assign to the content element.
	 */
	contentId?: ReadableProp<string>;
};
