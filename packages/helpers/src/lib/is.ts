export function isFunction(value: unknown): value is Function {
	return typeof value === "function";
}

export function isElement(element: unknown): element is Element {
	return element instanceof Element;
}

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function isTouch(event: PointerEvent): boolean {
	return event.pointerType === "touch";
}
