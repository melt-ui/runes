import { tick } from "svelte";
import { isFunction, isHTMLElement } from "./is.js";

export type FocusTarget = string | HTMLElement | null | undefined;
export type FocusProp = FocusTarget | ((defaultEl: HTMLElement | null) => FocusTarget);

export type HandleFocusArgs = {
	prop: FocusProp;
	defaultEl: HTMLElement | null;
};

export async function handleFocus(args: HandleFocusArgs): Promise<void> {
	const { prop, defaultEl } = args;

	const returned = isFunction(prop) ? prop(defaultEl) : prop;
	if (returned === null) {
		return;
	}

	await tick();

	if (returned === undefined) {
		defaultEl?.focus();
		return;
	}

	const el = typeof returned === "string" ? document.querySelector(returned) : returned;
	if (isHTMLElement(el)) {
		el.focus();
	}
}
