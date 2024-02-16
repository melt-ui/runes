import type { ReadableProp, WritableProp } from "$lib/internal/helpers/index.js";

export type ToggleProps = {
	pressed?: WritableProp<boolean>;
	disabled?: ReadableProp<boolean>;
};
