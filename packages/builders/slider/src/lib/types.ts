import type { ReadableProp } from "@melt-ui/helpers";

export type SliderOrientation = "horizontal" | "vertical";

export type SliderDirection = "ltr" | "rtl";

export type SliderProps = {
	/**
	 * The value of the slider.
	 *
	 * Pass in multiple values for multiple thumbs,
	 * creating a range slider.
	 *
	 * @default []
	 */
	value?: ReadableProp<number[]>;

	/**
	 * The minimum value of the slider.
	 *
	 * @default 0
	 */
	min?: ReadableProp<number>;

	/**
	 * The maximum value of the slider.
	 *
	 * @default 100
	 */
	max?: ReadableProp<number>;

	/**
	 * The amount to increment or decrement the value of the slider.
	 *
	 * @default 1
	 */
	step?: ReadableProp<number>;

	/**
	 * The orientation of the slider.
	 *
	 * @default 'horizontal'
	 */
	orientation?: ReadableProp<SliderOrientation>;

	/**
	 * The direction of the slider.
	 *
	 * For vertical sliders, setting `dir` to `rtl`
	 * causes the slider to be start from the top.
	 *
	 * @default 'ltr'
	 */
	dir?: ReadableProp<SliderDirection>;

	/**
	 * Whether or not the slider is disabled.
	 *
	 * @default false
	 */
	disabled?: ReadableProp<boolean>;

	/**
	 * Optionally override the default ids we assign to the root element.
	 */
	rootId?: ReadableProp<string>;
};
