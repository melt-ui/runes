// Modified from Grail UI v0.9.6 (2023-06-10)
// Source: https://github.com/grail-ui/grail-ui
// https://github.com/grail-ui/grail-ui/tree/master/packages/grail-ui/src/floating/placement.ts

import { isHTMLElement, noop } from "$lib/internal/helpers/index.js";
import type { VirtualElement } from "@floating-ui/core";
import {
	arrow,
	autoUpdate,
	computePosition,
	flip,
	offset,
	shift,
	size,
	type Middleware,
} from "@floating-ui/dom";
import type { FloatingConfig } from "./types.js";

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
