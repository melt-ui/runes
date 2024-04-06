import { element } from "@melt-ui/helpers";

export class Label {
	/**
	 * The root element's props.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 *   const label = new Label();
	 * </script>
	 *
	 * <label {...label.root()}>Label</label>
	 * ```
	 */
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
