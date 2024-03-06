import type { FloatingConfig, PortalTarget } from "$lib/internal/actions/index.js";
import type { ReadableProp, WritableProp } from "$lib/internal/helpers/index.js";

export type TooltipProps = {
	/**
	 * Whether or not the tooltip is open.
	 *
	 * @default false
	 */
	open?: WritableProp<boolean>;

	/**
	 * A configuration object which determines how the floating element
	 * is positioned relative to the trigger.
	 *
	 * If `null`, the element won't use floating-ui.
	 *
	 * @default placement: "bottom"
	 */
	positioning?: ReadableProp<FloatingConfig | null>;

	/**
	 * The size of the arrow which points to the trigger in pixels.
	 *
	 * @default 8
	 */
	arrowSize?: ReadableProp<number>;

	/**
	 * The delay in milliseconds before the tooltip opens after a `pointerenter` event.
	 *
	 * @default 1000
	 */
	openDelay?: ReadableProp<number>;

	/**
	 * The delay in milliseconds before the tooltip closes after a `pointerleave` event.
	 *
	 * @default 0
	 */
	closeDelay?: ReadableProp<number>;

	/**
	 * Whether the tooltip closes when the pointer is down.
	 *
	 * @default true
	 */
	closeOnPointerDown?: ReadableProp<boolean>;

	/**
	 * Whether or not to close the tooltip when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnEscape?: ReadableProp<boolean>;

	/**
	 * Whether or not to force the tooltip to always be visible.
	 *
	 * This is useful for custom transitions and animations using conditional blocks.
	 *
	 * @default false
	 */
	forceVisible?: ReadableProp<boolean>;

	/**
	 * Prevents the tooltip content element from remaining open when hovered.
	 *
	 * If `true`, the tooltip will only be open when hovering the trigger element.
	 *
	 * @default false
	 */
	disableHoverableContent?: ReadableProp<boolean>;

	/**
	 * If set to `true` or a string, whenever you open this tooltip
	 * all other tooltips with the same `group` value will close.
	 */
	group?: ReadableProp<boolean | string | undefined>;

	/**
	 * If not `undefined`, the tooltip will be rendered within the provided element or selector.
	 *
	 * If `null`, the element won't portal.
	 *
	 * @default 'body'
	 */
	portal?: ReadableProp<PortalTarget | null>;

	/**
	 * Optionally override the default id we assign to the trigger element.
	 */
	triggerId?: ReadableProp<string>;

	/**
	 * Optionally override the default id we assign to the content element.
	 */
	contentId?: ReadableProp<string>;
};
