import type { BoxOr, Read, Write } from "$lib/internal/helpers/box.svelte";


export type ToggleProps = {
	pressed?: BoxOr<Write<boolean>>;
	disabled?: BoxOr<Read<boolean>>;
};
