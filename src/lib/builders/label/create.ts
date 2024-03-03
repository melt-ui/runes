import { element } from "$lib/internal/helpers/index.js";

export class Label {
	root() {
		return element("label", {
			onmousedown(e: MouseEvent) {
				if (!e.defaultPrevented && e.detail > 1) {
					e.preventDefault();
				}
			},
		});
	}
}
