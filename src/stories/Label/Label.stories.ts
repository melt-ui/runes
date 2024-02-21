import type { Meta, StoryObj } from "@storybook/svelte";
import LabelPreview from "./LabelPreview.svelte";

const meta = {
	component: LabelPreview,
} satisfies Meta<LabelPreview>;

export default meta;

export const Label: StoryObj<LabelPreview> = {};
