import type { ChangeFn } from "$lib/internal/types";
import type { createToggle } from "./create.svelte";

export type CreateToggleProps = {
	pressed?: boolean;
	onPressedChange?: ChangeFn<boolean>;
	disabled?: boolean;
};

export type Toggle = ReturnType<typeof createToggle>;

export type { ToggleStates } from "./states.svelte";
