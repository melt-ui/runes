import {
	type ReadableBox,
	type WritableBox,
	booleanAttr,
	element,
	kbd,
	pack,
	pick,
	readableBox,
	toBoxes,
	writableBox,
} from "@melt-ui/helpers";
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
			"type": "button",
			get "aria-pressed"() {
				return toggle.pressed;
			},
			get "disabled"() {
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

export function createToggle(props: ToggleProps = {}) {
	const { pressed, disabled } = toBoxes({
		readables: pick({ disabled: false, ...props }, ["disabled"]),
		writables: pick({ pressed: false, ...props }, ["pressed"]),
	});

	const root = element("toggle", {
		"type": "button",
		get "aria-pressed"() {
			return pressed.value;
		},
		get "disabled"() {
			return booleanAttr(disabled.value);
		},
		get "data-disabled"() {
			return booleanAttr(disabled.value);
		},
		get "data-state"() {
			return pressed.value ? "on" : "off";
		},
		onclick() {
			if (disabled.value) {
				return;
			}
			pressed.value = !pressed.value;
		},
		onkeydown(event) {
			if (event.key !== kbd.ENTER && event.key !== kbd.SPACE) {
				return;
			}
			event.preventDefault();
			this.onclick();
		},
	});

	return pack({ root, pressed, disabled });
}
