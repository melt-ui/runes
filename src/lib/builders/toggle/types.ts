import type { ReadableProp, WritableProp } from "$lib/internal/helpers";

export type ToggleProps = {
	pressed?: WritableProp<boolean>;
	disabled?: ReadableProp<boolean>;
};
