import {
	addEventListener,
	builder,
	disabledAttr,
	executeCallbacks,
	kbd,
} from "$lib/internal/helpers";
import { ToggleStates } from "./states.svelte";
import type { CreateToggleProps } from "./types";

export function createToggle(props?: CreateToggleProps) {
	const states = new ToggleStates(props);
	const disabled = $derived(disabledAttr(states.disabled));
	const dataState = $derived(states.pressed ? "on" : "off");

	const root = builder("toggle", {
		props: {
			type: "button",
		} as const,
		getters: {
			disabled: () => disabled,
			"data-disabled": () => disabled,
			"data-state": () => dataState,
			"aria-pressed": () => states.pressed,
		} as const,
		action: (node) => {
			const destroy = executeCallbacks(
				addEventListener(node, "click", handleClick),
				addEventListener(node, "keydown", handleKeyDown),
			);
			return {
				destroy,
			};
		},
	});

	function handleClick() {
		if (states.disabled) return;
		states.pressed = !states.pressed;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
		e.preventDefault();
		handleClick();
	}

	return {
		root,
		states,
	};
}
