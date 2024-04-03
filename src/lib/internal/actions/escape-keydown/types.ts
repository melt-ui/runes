export type EscapeKeydownConfig = {
	/**
	 * Callback when user presses the escape key element.
	 */
	handler: (event: KeyboardEvent) => void;

	/**
	 * A predicate function or a list of elements that should not trigger the event.
	 */
	ignore?: ((event: KeyboardEvent) => boolean) | Element[];
};
