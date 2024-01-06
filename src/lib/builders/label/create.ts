import { addEventListener, builder } from "$lib/internal/helpers";

export class Label {
	readonly root = builder("label", {
		action: (node) => {
			const destroy = addEventListener(node, "mousedown", this.handleMouseDown.bind(this));
			return {
				destroy,
			};
		},
	});

	private handleMouseDown(e: MouseEvent) {
		if (!e.defaultPrevented && e.detail > 1) {
			e.preventDefault();
		}
	}
}
