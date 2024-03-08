export type InteractOutsideConfig = {
	/**
	 * Callback fired when an outside `pointerup` event completes.
	 */
	onInteractOutside?: (event: PointerEvent) => void;

	/**
	 * Callback fired when an outside `pointerdown` event starts.
	 *
	 * This callback is useful when you want to know when the user
	 * begins an outside interaction, but before the interaction
	 * completes.
	 */
	onInteractOutsideStart?: (event: PointerEvent) => void;
};
