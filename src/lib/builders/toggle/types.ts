import type { createToggle } from "./create.svelte";

export type CreateToggleProps = {
	disabled?: boolean;
	pressed?: boolean;
};

export type Toggle = ReturnType<typeof createToggle>;

export type { ToggleStates } from "./states.svelte";
