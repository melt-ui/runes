import { type Options as FocusTrapOptions, createFocusTrap } from "focus-trap";

export function useFocusTrap(node: HTMLElement, options: FocusTrapOptions) {
	$effect(() => {
		const trap = createFocusTrap(node, options).activate();
		return () => {
			trap.deactivate();
		};
	});
}
