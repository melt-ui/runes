import { MutableRef, Ref, disabledAttr, element, kbd } from "$lib/internal/helpers";
import { box, type Box, type BoxFrom, type BoxOr, type Read, type Write } from "$lib/internal/helpers/box.svelte";
import type { ToggleProps } from "./types";

const defaults = {
	pressed: false as boolean,
	disabled: false as boolean,
} satisfies ToggleProps;

const mergeProps = (props: ToggleProps) => ({ ...defaults, ...props });

type MergedProps = ReturnType<typeof mergeProps>

export class Toggle {
	#pressed: BoxFrom<MergedProps["pressed"]>;
	#disabled: BoxFrom<MergedProps["disabled"]>;

	constructor(props: ToggleProps = {}) {
		const { pressed, disabled } = mergeProps(props) as { pressed: BoxOr<Write<boolean>>, disabled: BoxOr<Read<boolean>> }
		this.#pressed = box.from(pressed);
		this.#disabled = box.from(disabled);
	}

	get pressed() {
		return this.#pressed.get()
	}

	set pressed(value: boolean) {
		this.#pressed.set(value)
	}

	get disabled() {
		return this.#disabled.get()
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
	const _pressed = box.from(props.pressed ?? false);
	const _disabled = box.from(props.disabled ?? false);

	const states = {
		get pressed() {
			return _pressed.get();
		},
		set pressed(value: boolean) {
			_pressed.set(value)
		},
		get disabled() {
			return _disabled.get();
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
