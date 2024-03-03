import type { EventHandler } from "$lib/internal/types.js";

// Overloaded function signatures for addEventListener

export function addEventListener<E extends keyof WindowEventMap>(
	target: Window,
	event: E,
	handler: (this: Window, event: WindowEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions,
): VoidFunction;

export function addEventListener<E extends keyof DocumentEventMap>(
	target: Document,
	event: E,
	handler: (this: Document, event: DocumentEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions,
): VoidFunction;

export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: EventTarget,
	event: E,
	handler: EventHandler<HTMLElementEventMap[E]>,
	options?: boolean | AddEventListenerOptions,
): VoidFunction;

/**
 * Adds an event listener to the specified target element for the given event,
 * and returns a function to remove it.
 *
 * @param target The target element to add the event listener to.
 * @param event The event to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener from the target element.
 */
export function addEventListener(
	target: EventTarget,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions,
) {
	target.addEventListener(event, handler, options);
	return () => target.removeEventListener(event, handler, options);
}
