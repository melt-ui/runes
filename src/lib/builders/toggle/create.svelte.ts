import { disabledAttr, kbd } from "$lib/internal/helpers";
import type { ToggleProps } from "./types";

export class Toggle {
	pressed: boolean = $state(false);
	disabled: boolean = $state(false);

	constructor(props: ToggleProps = {}) {
		const { pressed = false, disabled = false } = props;
		this.pressed = pressed;
		this.disabled = disabled;
	}

	readonly root = this.createRoot();

	private createRoot() {
		const self = this;
		const disabled = $derived(disabledAttr(this.disabled));
		const dataState = $derived(this.pressed ? "on" : "off");
		return {
			type: "button",
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
				return self.pressed;
			},
			onclick: this.handleClick.bind(this),
			onkeydown: this.handleKeydown.bind(this),
		} as const;
	}

	private handleClick() {
		if (this.disabled) return;
		this.pressed = !this.pressed;
	}

	private handleKeydown(e: KeyboardEvent) {
		if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
		e.preventDefault();
		this.handleClick();
	}
}
