export class Label {
	onmousedown = (e: MouseEvent) => {
		if (!e.defaultPrevented && e.detail > 1) {
			e.preventDefault();
		}
	};
}
