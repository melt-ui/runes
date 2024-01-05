import { builder } from "$lib/internal/helpers";

export class Label {
	readonly root = builder("label", {
		props: {
			onmousedown: this.handleMouseDown.bind(this),
		},
	});

	private handleMouseDown(e: MouseEvent) {
		if (!e.defaultPrevented && e.detail > 1) {
			e.preventDefault();
		}
	}
}
