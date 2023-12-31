export class Label {
	readonly root = {
		onmousedown: this.handleMouseDown.bind(this),
	} as const;

	private handleMouseDown(e: MouseEvent) {
		if (!e.defaultPrevented && e.detail > 1) {
			e.preventDefault();
		}
	}
}
