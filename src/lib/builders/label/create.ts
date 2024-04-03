import { element } from "$lib/internal/helpers/index.js";

export class Label {
	root() {
		return element("label", {
			onmousedown(event) {
				if (!event.defaultPrevented && event.detail > 1) {
					event.preventDefault();
				}
			},
		});
	}
}
