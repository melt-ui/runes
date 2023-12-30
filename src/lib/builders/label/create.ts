export class Label {
	readonly root = createRoot();
}

function createRoot() {
	return {
		onmousedown(e: MouseEvent) {
			if (!e.defaultPrevented && e.detail > 1) {
				e.preventDefault();
			}
		},
	} as const;
}
