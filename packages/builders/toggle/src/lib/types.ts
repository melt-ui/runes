import type { MaybeTransported, ReadableProp, WritableProp } from "@melt-ui/helpers";

export type ToggleProps = MaybeTransported<{
	/**
	 * Whether or not the toggle is pressed.
	 *
	 * @default false
	 */
	pressed?: boolean;
	setPressed?: (value: boolean) => void;

	/**
	 * Whether or not the toggle is disabled.
	 *
	 * @default false
	 */
	disabled?: boolean;
}>;
