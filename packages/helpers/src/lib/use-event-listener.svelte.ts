import { addEventListener } from "./event.js";

export function useEventListener<TEvent extends keyof WindowEventMap>(
	target: Window,
	event: TEvent,
	handler: (this: Window, event: WindowEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener<TEvent extends keyof DocumentEventMap>(
	target: Document,
	event: TEvent,
	handler: (this: Document, event: DocumentEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener<
	TElement extends HTMLElement,
	TEvent extends keyof HTMLElementEventMap,
>(
	target: TElement,
	event: TEvent,
	handler: (this: TElement, event: HTMLElementEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener(
	target: EventTarget,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener(
	target: EventTarget,
	event: string,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions,
) {
	$effect(() => {
		return addEventListener(target, event, listener, options);
	});
}
