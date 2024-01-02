import { addEventListener, builder } from "$lib/internal/helpers";

export function createLabel() {
	const root = builder("label", {
		action: (node) => {
			const destroy = addEventListener(node, "mousedown", handleMouseDown);
			return {
				destroy,
			};
		},
	});

	function handleMouseDown(e: MouseEvent) {
		if (!e.defaultPrevented && e.detail > 1) {
			e.preventDefault();
		}
	}

	return {
		root,
	};
}
