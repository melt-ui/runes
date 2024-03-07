import { isElement } from "$lib/internal/helpers/is.js";
import { useEventListener } from "../event-listener.svelte.js";
import type { InteractOutsideConfig, InteractOutsideEvent } from "./types.js";

export function useInteractOutside(node: HTMLElement, config: InteractOutsideConfig) {
	const { onInteractOutside, onInteractOutsideStart } = config;

	let isPointerDown = false;
	let isPointerDownInside = false;

	function shouldTriggerInteractOutside(event: InteractOutsideEvent) {
		if (isPointerDown && !isPointerDownInside && isValidEvent(event, node)) {
			return true;
		}
		return false;
	}

	function resetPointerState() {
		isPointerDown = false;
		isPointerDownInside = false;
	}

	function onPointerDown(event: PointerEvent | MouseEvent | TouchEvent) {
		if (onInteractOutside && isValidEvent(event, node)) {
			onInteractOutsideStart?.(event);
		}

		const target = event.target;
		if (isElement(target) && isOrContainsTarget(node, target)) {
			isPointerDownInside = true;
		}

		isPointerDown = true;
	}

	// Use pointer events if available, otherwise use mouse/touch events
	if (typeof PointerEvent !== "undefined") {
		const onPointerUp = (event: PointerEvent) => {
			if (shouldTriggerInteractOutside(event)) {
				onInteractOutside?.(event);
			}
			resetPointerState();
		};

		useEventListener(node.ownerDocument, "pointerdown", onPointerDown, true);
		useEventListener(node.ownerDocument, "pointerup", onPointerUp, true);
	} else {
		let ignoreEmulatedMouseEvents = false;

		const onMouseUp = (event: MouseEvent) => {
			if (ignoreEmulatedMouseEvents) {
				ignoreEmulatedMouseEvents = false;
			} else if (shouldTriggerInteractOutside(event)) {
				onInteractOutside?.(event);
			}
			resetPointerState();
		};

		const onTouchEnd = (event: TouchEvent) => {
			ignoreEmulatedMouseEvents = true;
			if (shouldTriggerInteractOutside(event)) {
				onInteractOutside?.(event);
			}
			resetPointerState();
		};

		useEventListener(node.ownerDocument, "mousedown", onPointerDown, true);
		useEventListener(node.ownerDocument, "mouseup", onMouseUp, true);
		useEventListener(node.ownerDocument, "touchstart", onPointerDown, true);
		useEventListener(node.ownerDocument, "touchend", onTouchEnd, true);
	}
}

function isValidEvent(event: InteractOutsideEvent, node: HTMLElement): boolean {
	if ("button" in event && event.button > 0) {
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

	return node && !isOrContainsTarget(node, target);
}

function isOrContainsTarget(node: HTMLElement, target: Element) {
	return node === target || node.contains(target);
}
