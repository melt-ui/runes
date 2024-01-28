import type { ReadBoxOr, WriteBoxOr } from "$lib/internal/helpers/box.svelte";

export type ToggleProps = {
	pressed?: WriteBoxOr<boolean>;
	disabled?: ReadBoxOr<boolean>;
};
