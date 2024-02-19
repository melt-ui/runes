import { element } from "$lib/internal/helpers/index.js";

const ELEMENTS = {
	root: "label",
} as const;

export class Label {
	root() {
		return element(ELEMENTS.root, {
			on: {
				mousedown: (e) => {
					if (!e.defaultPrevented && e.detail > 1) {
						e.preventDefault();
					}
				},
			},
		});
	}
}
