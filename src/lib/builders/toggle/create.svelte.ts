import {
	booleanAttr,
	element,
	kbd,
	readableBox,
	writableBox,
	type ReadableBox,
	type WritableBox,
} from "$lib/internal/helpers/index.js";
import type { ToggleProps } from "./types.js";

export class Toggle {
	#pressedBox: WritableBox<boolean>;
	#disabledBox: ReadableBox<boolean>;

	constructor(props: ToggleProps = {}) {
		const { pressed = false, disabled = false } = props;
		this.#pressedBox = writableBox(pressed);
		this.#disabledBox = readableBox(disabled);
	}

	get pressed() {
		return this.#pressedBox.value;
	}

	set pressed(v: boolean) {
		this.#pressedBox.value = v;
	}

	get disabled() {
		return this.#disabledBox.value;
	}

	root() {
		const toggle = this;
		return element("toggle", {
			type: "button",
			get "aria-pressed"() {
				return toggle.pressed;
			},
			get disabled() {
				return booleanAttr(toggle.disabled);
			},
			get "data-disabled"() {
				return booleanAttr(toggle.disabled);
			},
			get "data-state"() {
				return toggle.pressed ? "on" : "off";
			},
			onclick() {
				if (toggle.disabled) {
					return;
				}
				toggle.pressed = !toggle.pressed;
			},
			onkeydown(event) {
				if (event.key !== kbd.ENTER && event.key !== kbd.SPACE) {
					return;
				}
				event.preventDefault();
				this.onclick();
			},
		});
	}
}
