import { addEventListener } from "./event.js";

/**
 * Runs the given function once after the `outrostart` event is dispatched.
 *
 * @returns A function that removes the event listener from the target element.
 */
export function afterTransitionOutStarts(target: EventTarget, fn: () => void) {
	return addEventListener(target, "outrostart", fn, { once: true });
}

/**
 * Runs the given function once after the `outroend` event is dispatched.
 *
 * @returns A function that removes the event listener from the target element.
 */
export function afterTransitionOutEnds(target: EventTarget, fn: () => void) {
	return addEventListener(target, "outroend", fn, { once: true });
}

/**
 * Runs the given function once after the `outroend` event is dispatched,
 * or immediately if the element is not transitioning out.
 */
export function runAfterTransitionOutOrImmediate(target: EventTarget, fn: () => void) {
	let transitioningOut = false;

	const cleanupListener = afterTransitionOutStarts(target, () => {
		transitioningOut = true;
	});

	// Wait for the animation to begin.
	requestAnimationFrame(() => {
		if (transitioningOut) {
			afterTransitionOutEnds(target, fn);
		} else {
			cleanupListener();
			fn();
		}
	});
}
