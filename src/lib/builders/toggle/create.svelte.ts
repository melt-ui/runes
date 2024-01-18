import { element, disabledAttr, identity, kbd } from "$lib/internal/helpers";
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
	const onPressedChange = props.onPressedChange ?? identity;

	const states = {
		get pressed() {
			return _pressed;
		},
		set pressed(value: boolean) {
			_pressed = onPressedChange(value);
		},
		get disabled() {
			return _disabled;
		},
		set disabled(value: boolean) {
			_disabled = value;
		},
	}

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
			}
		},
	})


	return Object.assign(states, { root });
}