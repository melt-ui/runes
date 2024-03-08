import { createFocusTrap, type Options as FocusTrapOptions } from "focus-trap";

export function useFocusTrap(node: HTMLElement, options: FocusTrapOptions) {
	$effect(() => {
		const trap = createFocusTrap(node, options).activate();
		return () => {
			trap.deactivate();
		};
	});
}
