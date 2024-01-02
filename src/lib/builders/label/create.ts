import { addEventListener, defineProperties } from "$lib/internal/helpers";
import type { Action } from "svelte/action";

export function createLabel() {
	function handleMouseDown(e: MouseEvent) {
		if (!e.defaultPrevented && e.detail > 1) {
			e.preventDefault();
		}
	}

	const root: Action<HTMLElement> = (node) => {
		const destroy = addEventListener(node, "mousedown", handleMouseDown);
		return {
			destroy,
		};
	};

	defineProperties(root, {
		"data-melt-label": "",
	} as const);

	return {
		root,
	};
}
