import type { CreateToggleProps } from "./types";

export class ToggleStates {
	pressed: boolean = $state(false);
	disabled: boolean = $state(false);

	constructor(props: CreateToggleProps = {}) {
		const { pressed = false, disabled = false } = props;
		this.pressed = pressed;
		this.disabled = disabled;
	}
}
