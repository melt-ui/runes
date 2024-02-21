<script lang="ts">
	import { Tooltip } from "$lib/index.js";
	import type { FloatingConfig } from "$lib/internal/actions/index.js";
	import Like from "lucide-svelte/icons/thumbs-up";
	import { fade } from "svelte/transition";

	let {
		placement,
		gutter,
		arrowSize,
		openDelay,
		closeDelay,
		closeOnPointerDown,
		closeOnEscape,
		disableHoverableContent,
	} = $props<{
		placement: FloatingConfig["placement"];
		gutter: FloatingConfig["gutter"];
		arrowSize: number;
		openDelay: number;
		closeDelay: number;
		closeOnPointerDown: boolean;
		closeOnEscape: boolean;
		disableHoverableContent: boolean;
	}>();

	const positioning = $derived({ placement, gutter });

	const tooltip = new Tooltip({
		forceVisible: true,
		positioning: () => positioning,
		arrowSize: () => arrowSize,
		openDelay: () => openDelay,
		closeDelay: () => closeDelay,
		closeOnPointerDown: () => closeOnPointerDown,
		closeOnEscape: () => closeOnEscape,
		disableHoverableContent: () => disableHoverableContent,
	});
</script>

<div class="mx-auto w-fit p-4">
	<button
		{...tooltip.trigger()}
		aria-label="Like"
		class="flex h-10 w-10 items-center justify-center rounded-md bg-magnum-400 text-magnum-950"
	>
		<Like />
	</button>
</div>

{#if tooltip.open}
	<div
		{...tooltip.content()}
		class="rounded bg-neutral-50 px-2 py-1 text-sm text-neutral-900"
		transition:fade={{ duration: 200 }}
	>
		<div {...tooltip.arrow()} />
		<p>Like</p>
	</div>
{/if}
