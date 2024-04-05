// Modified from Grail UI v0.9.6 (2023-06-10)
// Source: https://github.com/grail-ui/grail-ui
// https://github.com/grail-ui/grail-ui/tree/master/packages/grail-ui/src/floating/placement.ts
// https://github.com/grail-ui/grail-ui/tree/master/packages/grail-ui/src/floating/floating.types.ts

import type { VirtualElement } from "@floating-ui/core";
import {
	type Boundary,
	type Middleware,
	arrow,
	autoUpdate,
	computePosition,
	flip,
	offset,
	shift,
	size,
} from "@floating-ui/dom";
import { isHTMLElement } from "./is.js";

/**
 * The floating element configuration.
 * @see https://floating-ui.com/
 */
export type FloatingConfig = {
	/**
	 * The initial placement of the floating element.
	 * @default "top"
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
	 */
	placement?:
		| "top"
		| "top-start"
		| "top-end"
		| "right"
		| "right-start"
		| "right-end"
		| "bottom"
		| "bottom-start"
		| "bottom-end"
		| "left"
		| "left-start"
		| "left-end";

	/**
	 * The strategy to use for positioning.
	 * @default "absolute"
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
	 */
	strategy?: "absolute" | "fixed";

	/**
	 * The offset of the floating element.
	 *
	 * @see https://floating-ui.com/docs/offset#options
	 */
	offset?: { mainAxis?: number; crossAxis?: number };

	/**
	 * The main axis offset or gap between the reference and floating elements.
	 * @default 5
	 *
	 * @see https://floating-ui.com/docs/offset#options
	 */
	gutter?: number;

	/**
	 * The virtual padding around the viewport edges to check for overflow.
	 * @default 8
	 *
	 * @see https://floating-ui.com/docs/detectOverflow#padding
	 */
	overflowPadding?: number;

	/**
	 * Whether to flip the placement.
	 * @default true
	 *
	 * @see https://floating-ui.com/docs/flip
	 */
	flip?: boolean;

	/**
	 * Whether the floating element can overlap the reference element.
	 * @default false
	 *
	 * @see https://floating-ui.com/docs/shift#options
	 */
	overlap?: boolean;

	/**
	 * Whether to make the floating element same width as the reference element.
	 * @default false
	 *
	 * @see https://floating-ui.com/docs/size
	 */
	sameWidth?: boolean;

	/**
	 * Whether the floating element should fit the viewport.
	 * @default false
	 *
	 * @see https://floating-ui.com/docs/size
	 */
	fitViewport?: boolean;

	/**
	 * The overflow boundary of the reference element.
	 *
	 * @see https://floating-ui.com/docs/detectoverflow#boundary
	 */
	boundary?: Boundary;
};

const ARROW_TRANSFORM = {
	bottom: "rotate(45deg)",
	left: "rotate(135deg)",
	top: "rotate(225deg)",
	right: "rotate(315deg)",
};

export function useFloating(
	reference: HTMLElement | VirtualElement,
	floating: HTMLElement,
	config: FloatingConfig = {},
) {
	const {
		placement = "top",
		strategy = "absolute",
		offset: floatingOffset,
		gutter = 5,
		overflowPadding = 8,
		flip: flipPlacement = true,
		overlap = false,
		sameWidth = false,
		fitViewport = false,
		boundary,
	} = config;

	const arrowEl = floating.querySelector("[data-arrow=true]");
	const middleware: Middleware[] = [];

	if (flipPlacement) {
		middleware.push(
			flip({
				boundary,
				padding: overflowPadding,
			}),
		);
	}

	const arrowOffset = isHTMLElement(arrowEl) ? arrowEl.offsetHeight / 2 : 0;
	if (gutter || offset) {
		const data = gutter ? { mainAxis: gutter } : floatingOffset;
		if (data?.mainAxis != null) {
			data.mainAxis += arrowOffset;
		}

		middleware.push(offset(data));
	}

	middleware.push(
		shift({
			boundary,
			crossAxis: overlap,
			padding: overflowPadding,
		}),
	);

	if (arrowEl) {
		middleware.push(arrow({ element: arrowEl, padding: 8 }));
	}

	middleware.push(
		size({
			padding: overflowPadding,
			apply({ rects, availableHeight, availableWidth }) {
				if (sameWidth) {
					Object.assign(floating.style, {
						width: `${Math.round(rects.reference.width)}px`,
						minWidth: "unset",
					});
				}

				if (fitViewport) {
					Object.assign(floating.style, {
						maxWidth: `${availableWidth}px`,
						maxHeight: `${availableHeight}px`,
					});
				}
			},
		}),
	);

	function compute() {
		computePosition(reference, floating, {
			placement,
			middleware,
			strategy,
		}).then((data) => {
			const x = Math.round(data.x);
			const y = Math.round(data.y);

			Object.assign(floating.style, {
				position: strategy,
				top: `${y}px`,
				left: `${x}px`,
			});

			if (isHTMLElement(arrowEl) && data.middlewareData.arrow) {
				const { x, y } = data.middlewareData.arrow;

				const dir = data.placement.split("-")[0] as "top" | "bottom" | "left" | "right";

				Object.assign(arrowEl.style, {
					position: "absolute",
					left: x != null ? `${x}px` : "",
					top: y != null ? `${y}px` : "",
					[dir]: `calc(100% - ${arrowOffset}px)`,
					transform: ARROW_TRANSFORM[dir],
					backgroundColor: "inherit",
					zIndex: "inherit",
				});
			}

			return data;
		});
	}

	// Apply `position` to floating element prior to the computePosition() call.
	floating.style.position = strategy;

	$effect(() => {
		const cleanup = autoUpdate(reference, floating, compute);
		return cleanup;
	});
}
