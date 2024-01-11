<script lang="ts">
	import { Tooltip } from "$lib/builders/tooltip";
	import { melt } from "@melt-ui/svelte";
	import { fade } from "svelte/transition";

	const tooltip = new Tooltip({
		openDelay: 0,
		closeDelay: 1000,
		forceVisible: true,
		onOpenChange: (open) => {
			console.log("onOpenChange", open);
			return open;
		},
	});

	$inspect(tooltip.open);
</script>

<button use:melt={tooltip.trigger} class="btn">Trigger</button>

{#if tooltip.open}
	<div
		use:melt={tooltip.content}
		transition:fade={{ duration: 200 }}
		class="rounded bg-gray-50 px-2 py-1 text-sm text-gray-950"
	>
		<div use:melt={tooltip.arrow} />
		<p>Hello world</p>
	</div>
{/if}
