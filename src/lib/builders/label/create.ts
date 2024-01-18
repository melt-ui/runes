import { element } from "$lib/internal/helpers";

export class Label {
	readonly root = element("label", {
		props: {
			onmousedown(e: MouseEvent) {
				if (!e.defaultPrevented && e.detail > 1) {
					e.preventDefault();
				}
			},
		},
	});
}
