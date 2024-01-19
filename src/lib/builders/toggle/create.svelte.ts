import { Syncable, disabledAttr, element, kbd } from "$lib/internal/helpers";
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
	const _pressed = new Syncable(props.pressed ?? false);
	const _disabled = new Syncable(props.disabled ?? false);

	const states = {
		get pressed() {
			return _pressed.get();
		},
		set pressed(value: boolean) {
			_pressed.set(value);
		},
		get disabled() {
			return _disabled.get();
		},
		set disabled(value: boolean) {
			_disabled.set(value);
		},
	};

	const root = element("toggle", {
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
	});

	return Object.assign(states, { root });
}
