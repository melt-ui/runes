import {
	addEventListener,
	builder,
	disabledAttr,
	executeCallbacks,
	identity,
	kbd,
} from "$lib/internal/helpers";
import type { ChangeFn } from "$lib/internal/types";
import type { ToggleProps } from "./types";

export class Toggle {
	private _pressed: boolean = $state(false);
	private onPressedChange: ChangeFn<boolean>;
	disabled: boolean = $state(false);

	constructor(props: ToggleProps = {}) {
		const { pressed = false, onPressedChange = identity, disabled = false } = props;
		this._pressed = pressed;
		this.onPressedChange = onPressedChange;
		this.disabled = disabled;
	}

	get pressed() {
		return this._pressed;
	}

	set pressed(value: boolean) {
		this._pressed = this.onPressedChange(value);
	}

	readonly root = this.createRoot();

	private createRoot() {
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
			},
			action: (node) => {
				const destroy = executeCallbacks(
					addEventListener(node, "click", this.handleClick.bind(this)),
					addEventListener(node, "keydown", this.handleKeyDown.bind(this)),
				);
				return {
					destroy,
				};
			},
		});
	}

	private handleClick() {
		if (this.disabled) return;
		this.pressed = !this.pressed;
	}

	private handleKeyDown(e: KeyboardEvent) {
		if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
		e.preventDefault();
		this.handleClick();
	}
}
