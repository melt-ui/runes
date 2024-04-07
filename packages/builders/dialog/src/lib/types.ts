import type { FocusProp, PortalTarget, ReadableProp, WritableProp } from "@melt-ui/helpers";

export type DialogRole = "dialog" | "alertdialog";

export type DialogProps = {
	/**
	 * Whether or not the dialog is open.
	 *
	 * @default false
	 */
	open?: WritableProp<boolean>;

	/**
	 * If `true`, the dialog will prevent scrolling on the body
	 * when it is open.
	 *
	 * @default true
	 */
	preventScroll?: ReadableProp<boolean>;

	/**
	 * If `true`, the dialog will close when the user presses the escape key.
	 *
	 * @default true
	 */
	closeOnEscape?: ReadableProp<boolean>;

	/**
	 * If `true`, the dialog will close when the user clicks outside of it.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: ReadableProp<boolean>;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 *
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: (event: PointerEvent) => void;

	/**
	 * The `role` attribute to apply to the dialog.
	 *
	 * @default 'dialog'
	 */
	role?: ReadableProp<DialogRole>;

	/**
	 * If not `undefined`, the dialog content will be rendered within the provided element or selector.
	 */
	portal?: ReadableProp<PortalTarget>;

	/**
	 * Override the default autofocus behavior of the dialog
	 * on open.
	 */
	openFocus?: ReadableProp<FocusProp>;

	/**
	 * Override the default autofocus behavior of the dialog
	 * on close.
	 */
	closeFocus?: ReadableProp<FocusProp>;

	/**
	 * Optionally override the default id we assign to the overlay element.
	 */
	overlayId?: ReadableProp<string>;

	/**
	 * Optionally override the default id we assign to the content element.
	 */
	contentId?: ReadableProp<string>;

	/**
	 * Optionally override the default id we assign to the portalled element.
	 */
	portalledId?: ReadableProp<string>;

	/**
	 * Optionally override the default id we assign to the title element.
	 */
	titleId?: ReadableProp<string>;

	/**
	 * Optionally override the default id we assign to the description element.
	 */
	descriptionId?: ReadableProp<string>;
};
