import { disabledAttr, kbd } from "$lib/internal/helpers";
import type { ToggleProps } from "./types";

export class Toggle {
	pressed = $state(false);
	disabled = $state(false);

	constructor(props: ToggleProps = {}) {
		const { pressed = false, disabled = false } = props;
		this.pressed = pressed;
		this.disabled = disabled;
	}

	readonly root = createRoot(this);
}

function createRoot(toggle: Toggle) {
	const disabled = $derived(disabledAttr(toggle.disabled));
	const dataState = $derived(toggle.pressed ? "on" : "off");
	return {
		get disabled() {
			return disabled;
		},
		get "data-disabled"() {
			return disabled;
		},
		get "data-state"() {
			return dataState;
		},
		get "aria-pressed"() {
			return toggle.pressed;
		},
		type: "button",
		onclick() {
			if (toggle.disabled) return;
			toggle.pressed = !toggle.pressed;
		},
		onkeydown(e: KeyboardEvent) {
			if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
			e.preventDefault();
			this.onclick();
		},
	} as const;
}
