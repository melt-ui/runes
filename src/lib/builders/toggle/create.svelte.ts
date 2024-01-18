import { Syncable, disabledAttr, element, isControlledProp, kbd } from "$lib/internal/helpers";
import type { ToggleProps } from "./types";

export class Toggle {
	#pressed: Syncable<boolean>;
	#disabled: Syncable<boolean>;

	constructor(props: ToggleProps = {}) {
		const { pressed = false, disabled = false } = props;
		this.#pressed = new Syncable(pressed);
		this.#disabled = new Syncable(disabled);
	}

	get pressed() {
		return this.#pressed.get();
	}

	set pressed(value: boolean) {
		this.#pressed.set(value);
	}

	get disabled() {
		return this.#disabled.get();
	}

	set disabled(value: boolean) {
		this.#disabled.set(value);
	}

	readonly root = this.#createRoot();

	#createRoot() {
		const self = this;
		return element("toggle", {
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
					console.log("onclick b4", self.pressed);
					self.pressed = !self.pressed;
					console.log("onclick after", self.pressed);
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

// I did this to compare the two approaches.
// My findings:
// - I found myself recreating some of the concepts present in classes, such as private methods.
// But this does require more trust in the developers hands, so it is a slippery slope.
// - The two generated the same amount of code! But I trust it'd get bigger with the fn approach as time went on,
// due to the need of creating getters and setters for every modifiable property.
// - I still think the fn approach is more readable. It's so clean! But classes aren't bad either.
export function createToggle(props: ToggleProps = {}) {
	let _pressed = $state(props.pressed ?? false);
	let _disabled = $state(props.disabled ?? false);

	const states = {
		get pressed() {
			return isControlledProp(_pressed) ? _pressed.get() : _pressed;
		},
		set pressed(value: boolean) {
			if (isControlledProp(_pressed)) {
				_pressed.set(value);
			} else {
				_pressed = value;
			}
		},
		get disabled() {
			return isControlledProp(_disabled) ? _disabled.get() : _disabled;
		},
		set disabled(value: boolean) {
			if (isControlledProp(_disabled)) {
				_disabled.set(value);
			} else {
				_disabled = value;
			}
		},
	};

	const root = element("toggle", {
		props: {
			get disabled() {
				return disabledAttr(states.disabled);
			},
			get "data-disabled"() {
				return disabledAttr(states.disabled);
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
		},
	});

	return Object.assign(states, { root });
}
