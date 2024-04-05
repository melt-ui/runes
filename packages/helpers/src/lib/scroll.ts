// Modified from @zag-js/remove-scroll v0.10.2 (2023-06-10)
// Source: https://github.com/chakra-ui/zag
// https://github.com/chakra-ui/zag/blob/main/packages/utilities/remove-scroll/src/index.ts

import { noop } from "./callbacks.js";
import { isIos } from "./platform.js";

const DATA_LOCK_ATTR = "data-melt-scroll-lock";

function assignStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>) {
	const previousStyle = el.style.cssText;
	Object.assign(el.style, style);
	return () => {
		el.style.cssText = previousStyle;
	};
}

function setCSSProperty(el: HTMLElement, property: string, value: string) {
	const previousValue = el.style.getPropertyValue(property);
	el.style.setProperty(property, value);
	return () => {
		if (previousValue) {
			el.style.setProperty(property, previousValue);
		} else {
			el.style.removeProperty(property);
		}
	};
}

function getPaddingProperty(documentElement: HTMLElement) {
	// RTL <body> scrollbar
	const documentLeft = documentElement.getBoundingClientRect().left;
	const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
	return scrollbarX ? "paddingLeft" : "paddingRight";
}

export function removeScroll(): () => void {
	const win = document.defaultView ?? window;
	const { documentElement, body } = document;

	const locked = body.hasAttribute(DATA_LOCK_ATTR);
	if (locked) {
		return noop;
	}

	body.setAttribute(DATA_LOCK_ATTR, "");

	const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
	const paddingProperty = getPaddingProperty(documentElement);
	const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];

	const restoreScrollbarWidth = setCSSProperty(
		documentElement,
		"--scrollbar-width",
		`${scrollbarWidth}px`,
	);

	let restoreBodyStyle: () => void;
	if (isIos()) {
		// Only iOS doesn't respect `overflow: hidden` on document.body
		const { scrollX, scrollY, visualViewport } = win;

		// iOS 12 does not support `visualViewport`.
		const offsetLeft = visualViewport?.offsetLeft ?? 0;
		const offsetTop = visualViewport?.offsetTop ?? 0;

		const restoreStyle = assignStyle(body, {
			position: "fixed",
			overflow: "hidden",
			top: `${-(scrollY - Math.floor(offsetTop))}px`,
			left: `${-(scrollX - Math.floor(offsetLeft))}px`,
			right: "0",
			[paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`,
		});

		restoreBodyStyle = () => {
			restoreStyle();
			win.scrollTo(scrollX, scrollY);
		};
	} else {
		restoreBodyStyle = assignStyle(body, {
			overflow: "hidden",
			[paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`,
		});
	}

	return () => {
		restoreScrollbarWidth();
		restoreBodyStyle();
		body.removeAttribute(DATA_LOCK_ATTR);
	};
}
