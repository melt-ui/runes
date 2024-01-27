<script lang="ts">
	import { Tooltip } from "$lib";
	import { fade } from "svelte/transition";
	import TooltipComponent from "./Tooltip.svelte";

	const tooltip = new Tooltip({
		openDelay: 0,
		closeDelay: 1000,
		forceVisible: true,
	});

	$inspect(tooltip.open);
</script>

<button {...tooltip.trigger} class="btn">Trigger</button>

{#if tooltip.open}
	<div {...tooltip.content} class="tooltip" transition:fade={{ duration: 200 }}>
		<div {...tooltip.arrow} />
		<p>Hello world</p>
	</div>
{/if}

<hr class="my-8" />

<TooltipComponent>
	{#snippet trigger(props)}
		<button {...props} class="btn">Trigger</button>
	{/snippet}

	{#snippet content()}
		Hello world
	{/snippet}
</TooltipComponent>
