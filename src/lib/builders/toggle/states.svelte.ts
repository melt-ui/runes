import { identity } from "$lib/internal/helpers";
import type { ChangeFn } from "$lib/internal/types";
import type { CreateToggleProps } from "./types";

export class ToggleStates {
	private _pressed: boolean = $state(false);
	private _onPressedChange: ChangeFn<boolean>;
	disabled: boolean = $state(false);

	constructor(props: CreateToggleProps = {}) {
		const { pressed = false, onPressedChange = identity, disabled = false } = props;
		this._pressed = pressed;
		this._onPressedChange = onPressedChange;
		this.disabled = disabled;
	}

	get pressed() {
		return this._pressed;
	}

	set pressed(value: boolean) {
		this._pressed = this._onPressedChange(value);
	}
}
