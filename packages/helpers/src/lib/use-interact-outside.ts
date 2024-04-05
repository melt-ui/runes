import { isElement } from "./is.js";
import { useEventListener } from "./use-event-listener.svelte.js";

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

function isValidEvent(event: PointerEvent, node: HTMLElement): boolean {
	if (event.button > 0) {
		return false;
	}

	const target = event.target;
	if (!isElement(target)) {
		return false;
	}

	// if the target is no longer in the document (e.g. it was removed) ignore it
	const ownerDocument = target.ownerDocument;
	if (!ownerDocument || !ownerDocument.documentElement.contains(target)) {
		return false;
	}

	return !equalsOrContainsTarget(node, target);
}

function equalsOrContainsTarget(node: HTMLElement, target: Element) {
	return node === target || node.contains(target);
}

export function useInteractOutside(node: HTMLElement, config: InteractOutsideConfig) {
	const { onInteractOutside, onInteractOutsideStart } = config;

	let isPointerDown = false;
	let isPointerDownInside = false;

	function onPointerDown(event: PointerEvent) {
		if (onInteractOutside && isValidEvent(event, node)) {
			onInteractOutsideStart?.(event);
		}

		const target = event.target;
		if (isElement(target) && equalsOrContainsTarget(node, target)) {
			isPointerDownInside = true;
		}

		isPointerDown = true;
	}

	function onPointerUp(event: PointerEvent) {
		if (isPointerDown && !isPointerDownInside && isValidEvent(event, node)) {
			onInteractOutside?.(event);
		}

		isPointerDown = false;
		isPointerDownInside = false;
	}

	useEventListener(node.ownerDocument, "pointerdown", onPointerDown, true);
	useEventListener(node.ownerDocument, "pointerup", onPointerUp, true);
}
