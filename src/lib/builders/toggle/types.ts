import type { ChangeFn } from "$lib/internal/types";

export type ToggleProps = {
	pressed?: boolean;
	onPressedChange?: ChangeFn<boolean>;
	disabled?: boolean;
};
