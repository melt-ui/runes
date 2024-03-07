import { StartStop, isFunction, isHTMLElement, kbd } from "$lib/internal/helpers/index.js";
import type { EscapeKeydownConfig } from "./types.js";

/**
 * Tracks the latest Escape keydown that occurred on the document.
 */
const documentEscapeKeyDown = new StartStop<KeyboardEvent | null>(null, (set) => {
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === kbd.ESCAPE) {
			set(event);
		}

		// Prevent new subscribers from triggering immediately.
		set(null);
	}

	document.addEventListener("keydown", handleKeyDown, {
		passive: false,
	});

	return () => {
		document.removeEventListener("keydown", handleKeyDown);
	};
});

export function useEscapeKeydown(node: HTMLElement, config: EscapeKeydownConfig) {
	const { handler, ignore } = config;

	$effect(() => {
		const event = documentEscapeKeyDown.value;
		if (event === null) {
			return;
		}

		const target = event.target;
		if (!isHTMLElement(target) || target.closest("[data-escapee]") !== node) {
			return;
		}

		event.preventDefault();

		// If an ignore function is passed, check if it returns true
		if (isFunction(ignore) && ignore(event)) {
			return;
		}

		// If an ignore array is passed, check if any elements in the array match the target
		if (Array.isArray(ignore) && ignore.includes(target)) {
			return;
		}

		// If none of the above conditions are met, call the handler
		handler(event);
	});

	$effect(() => {
		node.dataset.escapee = "";
		return () => {
			delete node.dataset.escapee;
		};
	});
}
