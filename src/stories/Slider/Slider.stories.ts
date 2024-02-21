import type { Meta, StoryObj } from "@storybook/svelte";
import SliderPreview from "./SliderPreview.svelte";

const meta = {
	component: SliderPreview,
	args: {
		min: 0,
		max: 100,
		step: 1,
		orientation: "horizontal",
		dir: "ltr",
		disabled: false,
		ticks: false,
	},
	argTypes: {
		min: {
			type: "number",
		},
		max: {
			type: "number",
		},
		step: {
			type: "number",
		},
		orientation: {
			type: {
				name: "enum",
				value: ["horizontal", "vertical"],
			},
		},
		dir: {
			type: {
				name: "enum",
				value: ["ltr", "rtl"],
			},
		},
		disabled: {
			type: "boolean",
		},
	},
} satisfies Meta<SliderPreview>;

export default meta;

export const Default: StoryObj<SliderPreview> = {};

export const Ticks: StoryObj<SliderPreview> = {
	args: {
		min: 0,
		max: 10,
		step: 3,
		ticks: true,
	},
};

export const Vertical: StoryObj<SliderPreview> = {
	args: {
		orientation: "vertical",
	},
};

export const RTL: StoryObj<SliderPreview> = {
	args: {
		dir: "rtl",
	},
};
