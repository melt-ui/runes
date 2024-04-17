import {
	booleanAttr,
	element,
	kbd,
	receiveObj,
} from "@melt-ui/helpers";
import type { ToggleProps } from "./types.js";

export function createToggle(_props: ToggleProps = {}) {
	const props = receiveObj(_props, {
		pressed: false,
		disabled: false,
	});

	const root = element("toggle", () => {
		function onclick() {
			if (props.disabled) {
				return;
			}
			props.pressed = !props.pressed;
		}

		function onkeydown(event: KeyboardEvent) {
			if (event.key !== kbd.ENTER && event.key !== kbd.SPACE) {
				return;
			}
			event.preventDefault();
			onclick();
		}

		return ({
			"type": "button",
			get "aria-pressed"() {
				return props.pressed;
			},
			get "disabled"() {
				return booleanAttr(props.disabled);
			},
			get "data-disabled"() {
				return booleanAttr(props.disabled);
			},
			get "data-state"() {
				return props.pressed ? "on" : "off";
			},
			onclick,
			onkeydown,
		});
	});

	return Object.assign(props, { root });
}
