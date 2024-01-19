import { element } from "$lib/internal/helpers";

export class Label {
	readonly root = element("label", {
		onmousedown(e: MouseEvent) {
			if (!e.defaultPrevented && e.detail > 1) {
				e.preventDefault();
			}
		},
	});
}
