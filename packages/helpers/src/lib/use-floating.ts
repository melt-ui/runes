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
	 * @defaultValue `"top"`
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
	 * @defaultValue `"absolute"`
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
	 * @defaultValue `5`
	 *
	 * @see https://floating-ui.com/docs/offset#options
	 */
	gutter?: number;

	/**
	 * The virtual padding around the viewport edges to check for overflow.
	 * @defaultValue `8`
	 *
	 * @see https://floating-ui.com/docs/detectOverflow#padding
	 */
	overflowPadding?: number;

	/**
	 * Whether to flip the placement.
	 * @defaultValue `true`
	 *
	 * @see https://floating-ui.com/docs/flip
	 */
	flip?: boolean;

	/**
	 * Whether the floating element can overlap the reference element.
	 * @defaultValue `false`
	 *
	 * @see https://floating-ui.com/docs/shift#options
	 */
	overlap?: boolean;

	/**
	 * Whether to make the floating element same width as the reference element.
	 * @defaultValue `false`
	 *
	 * @see https://floating-ui.com/docs/size
	 */
	sameWidth?: boolean;

	/**
	 * Whether the floating element should fit the viewport.
	 * @defaultValue `false`
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

const defaultConfig = {
	strategy: "absolute",
	placement: "top",
	gutter: 5,
	flip: true,
	sameWidth: false,
	overflowPadding: 8,
} satisfies FloatingConfig;

const ARROW_TRANSFORM = {
	bottom: "rotate(45deg)",
	left: "rotate(135deg)",
	top: "rotate(225deg)",
	right: "rotate(315deg)",
};

// TODO: use `$effect` to automatically cleanup
export function useFloating(
	reference: HTMLElement | VirtualElement,
	floating: HTMLElement,
	config: FloatingConfig | null = {},
) {
	if (config === null) {
		return { destroy: noop };
	}

	const options = { ...defaultConfig, ...config } satisfies FloatingConfig;

	const arrowEl = floating.querySelector("[data-arrow=true]");
	const middleware: Middleware[] = [];

	if (options.flip) {
		middleware.push(
			flip({
				boundary: options.boundary,
				padding: options.overflowPadding,
			}),
		);
	}

	const arrowOffset = isHTMLElement(arrowEl) ? arrowEl.offsetHeight / 2 : 0;
	if (options.gutter || options.offset) {
		const data = options.gutter ? { mainAxis: options.gutter } : options.offset;
		if (data?.mainAxis != null) {
			data.mainAxis += arrowOffset;
		}

		middleware.push(offset(data));
	}

	middleware.push(
		shift({
			boundary: options.boundary,
			crossAxis: options.overlap,
			padding: options.overflowPadding,
		}),
	);

	if (arrowEl) {
		middleware.push(arrow({ element: arrowEl, padding: 8 }));
	}

	middleware.push(
		size({
			padding: options.overflowPadding,
			apply({ rects, availableHeight, availableWidth }) {
				if (options.sameWidth) {
					Object.assign(floating.style, {
						width: `${Math.round(rects.reference.width)}px`,
						minWidth: "unset",
					});
				}

				if (options.fitViewport) {
					Object.assign(floating.style, {
						maxWidth: `${availableWidth}px`,
						maxHeight: `${availableHeight}px`,
					});
				}
			},
		}),
	);

	function compute() {
		const { placement, strategy } = options;

		computePosition(reference, floating, {
			placement,
			middleware,
			strategy,
		}).then((data) => {
			const x = Math.round(data.x);
			const y = Math.round(data.y);

			Object.assign(floating.style, {
				position: options.strategy,
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
	Object.assign(floating.style, {
		position: options.strategy,
	});

	return {
		destroy: autoUpdate(reference, floating, compute),
	};
}
