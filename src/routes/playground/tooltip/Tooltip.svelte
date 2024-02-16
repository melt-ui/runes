<script lang="ts">
	import { Tooltip } from "$lib/index.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { fade } from "svelte/transition";

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
		open?: boolean;

		trigger: Snippet<Tooltip["trigger"]>;

		content: Snippet;
	}

	let { open = false, class: className = "", trigger, content, ...props } = $props<Props>();

	const tooltip = new Tooltip({
		open: {
			get: () => open,
			set: (v) => (open = v),
		},
		openDelay: 0,
		closeDelay: 1000,
		forceVisible: true,
	});
</script>

{@render trigger(tooltip.trigger)}

{#if open}
	<div
		{...tooltip.content}
		{...props}
		class="tooltip {className}"
		transition:fade={{ duration: 200 }}
	>
		{@render content()}
	</div>
{/if}
