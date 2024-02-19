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

const ELEMENTS = {
	root: "toggle",
} as const;

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
		const self = this;
		return element(ELEMENTS.root, {
			type: "button",
			get "aria-pressed"() {
				return self.pressed;
			},
			get disabled() {
				return booleanAttr(self.disabled);
			},
			get "data-disabled"() {
				return booleanAttr(self.disabled);
			},
			get "data-state"() {
				return self.pressed ? "on" : "off";
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
		});
	}
}

// I did this to compare the two approaches.
// My findings:
// - I found myself recreating some of the concepts present in classes, such as private methods.
// But this does require more trust in the developers hands, so it is a slippery slope.
// - The two generated the same amount of code! But I trust it'd get bigger with the fn approach as time went on,
// due to the need of creating getters and setters for every modifiable property.
// - I still think the fn approach is more readable. It's so clean! But classes aren't bad either.
export function createToggle(props: ToggleProps = {}) {
	const _pressed = writableBox(props.pressed ?? false);
	const _disabled = readableBox(props.disabled ?? false);

	const states = {
		get pressed() {
			return _pressed.value;
		},
		set pressed(v: boolean) {
			_pressed.value = v;
		},
		get disabled() {
			return _disabled.value;
		},
	};

	const root = element("toggle", {
		get disabled() {
			return booleanAttr(states.disabled);
		},
		get "data-disabled"() {
			return booleanAttr(states.disabled);
		},
		get "data-state"() {
			return states.pressed ? "on" : "off";
		},
		get "aria-pressed"() {
			return states.pressed;
		},
		onclick() {
			if (states.disabled) return;
			states.pressed = !states.pressed;
		},
		onkeydown(e: KeyboardEvent) {
			if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
			e.preventDefault();
			this.onclick();
		},
	});

	return Object.assign(states, { root });
}
