import type { Meta, StoryObj } from "@storybook/svelte";
import TogglePreview from "./TogglePreview.svelte";

const meta = {
	component: TogglePreview,
	args: {
		disabled: false,
	},
	argTypes: {
		disabled: {
			type: "boolean",
		},
	},
} satisfies Meta<TogglePreview>;

export default meta;

export const Toggle: StoryObj<TogglePreview> = {};
