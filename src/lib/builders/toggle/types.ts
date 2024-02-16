import type { ReadableProp, WritableProp } from "$lib/internal/helpers/index.js";

export type ToggleProps = {
	/**
	 * Whether or not the toggle is pressed.
	 *
	 * @default false
	 */
	pressed?: WritableProp<boolean>;

	/**
	 * Whether or not the toggle is disabled.
	 *
	 * @default false
	 */
	disabled?: ReadableProp<boolean>;
};
