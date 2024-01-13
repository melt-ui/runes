import { builder, disabledAttr, identity, kbd } from "$lib/internal/helpers";
import type { ChangeFn } from "$lib/internal/types";
import type { ToggleProps } from "./types";

export class Toggle {
	#pressed: boolean = $state(false);
	readonly #onPressedChange: ChangeFn<boolean>;
	disabled: boolean = $state(false);

	constructor(props: ToggleProps = {}) {
		const { pressed = false, onPressedChange = identity, disabled = false } = props;
		this.#pressed = pressed;
		this.#onPressedChange = onPressedChange;
		this.disabled = disabled;
	}

	get pressed() {
		return this.#pressed;
	}

	set pressed(value: boolean) {
		this.#pressed = this.#onPressedChange(value);
	}

	readonly root = this.#createRoot();

	#createRoot() {
		const self = this;
		return builder("toggle", {
			props: {
				type: "button",
				get disabled() {
					return disabledAttr(self.disabled);
				},
				get "data-disabled"() {
					return disabledAttr(self.disabled);
				},
				get "data-state"() {
					return self.pressed ? "on" : "off";
				},
				get "aria-pressed"() {
					return self.pressed;
				},
				onclick() {
					if (self.disabled) return;
					self.pressed = !self.pressed;
				},
				onkeydown(e: KeyboardEvent) {
					if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
					e.preventDefault();
					this.onclick();
				},
			},
		});
	}
}
