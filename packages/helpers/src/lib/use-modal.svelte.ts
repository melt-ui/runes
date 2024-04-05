import { isElement } from "./is.js";
import { useInteractOutside } from "./use-interact-outside.js";

export type ModalConfig = {
	/**
	 * Handler called when the overlay closes.
	 */
	onClose?: () => void;

	/**
	 * Whether the modal is able to be closed by interacting outside of it.
	 * If true, the `onClose` callback will be called when the user interacts
	 * outside of the modal.
	 *
	 * @default true
	 */
	closeOnInteractOutside?: boolean;

	/**
	 * If `closeOnInteractOutside` is `true` and this function is provided,
	 * it will be called with the element that the outside interaction occurred
	 * on. Whatever is returned from this function will determine whether the
	 * modal actually closes or not.
	 *
	 * This is useful to filter out interactions with certain elements from
	 * closing the modal. If `closeOnInteractOutside` is `false`, this function
	 * will not be called.
	 */
	shouldCloseOnInteractOutside?: (event: PointerEvent) => boolean;
};

const visibleModals: HTMLElement[] = [];

function removeFromVisibleModals(node: HTMLElement) {
	const index = visibleModals.indexOf(node);
	if (index >= 0) {
		visibleModals.splice(index, 1);
	}
}

function isLastModal(node: HTMLElement) {
	return node === visibleModals.at(-1);
}

export function useModal(node: HTMLElement, config: ModalConfig) {
	const { onClose, closeOnInteractOutside = true, shouldCloseOnInteractOutside } = config;

	$effect(() => {
		visibleModals.push(node);
		return () => {
			removeFromVisibleModals(node);
		};
	});

	useInteractOutside(node, {
		onInteractOutsideStart(event) {
			const target = event.target;
			if (!isElement(target) || !isLastModal(node)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
		},
		onInteractOutside(event) {
			// We only want to call `onClose` if this is the topmost modal
			if (!closeOnInteractOutside || !isLastModal(node)) {
				return;
			}

			if (shouldCloseOnInteractOutside !== undefined && !shouldCloseOnInteractOutside(event)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			if (onClose !== undefined) {
				onClose();
				visibleModals.pop();
			}
		},
	});
}
