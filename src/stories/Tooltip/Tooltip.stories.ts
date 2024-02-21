import type { Meta, StoryObj } from "@storybook/svelte";
import TooltipPreview from "./TooltipPreview.svelte";

const meta = {
	component: TooltipPreview,
	args: {
		placement: "bottom",
		gutter: 5,
		arrowSize: 8,
		openDelay: 1000,
		closeDelay: 0,
		closeOnPointerDown: true,
		closeOnEscape: true,
		disableHoverableContent: false,
	},
	argTypes: {
		placement: {
			type: {
				name: "enum",
				value: [
					"top-start",
					"top",
					"top-end",
					"right-start",
					"right",
					"right-end",
					"bottom-start",
					"bottom",
					"bottom-end",
					"left-start",
					"left",
					"left-end",
				],
			},
		},
		gutter: {
			type: "number",
		},
		arrowSize: {
			type: "number",
		},
		openDelay: {
			type: "number",
		},
		closeDelay: {
			type: "number",
		},
		closeOnPointerDown: {
			type: "boolean",
		},
		closeOnEscape: {
			type: "boolean",
		},
		disableHoverableContent: {
			type: "boolean",
		},
	},
} satisfies Meta<TooltipPreview>;

export default meta;

export const Tooltip: StoryObj<TooltipPreview> = {};
