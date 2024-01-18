import type { ControllableProp } from "$lib/internal/helpers";

export type ToggleProps = {
	pressed?: ControllableProp<boolean>;
	disabled?: ControllableProp<boolean>;
};
