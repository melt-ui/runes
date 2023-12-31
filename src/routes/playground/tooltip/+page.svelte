<script lang="ts">
	import { fade } from "svelte/transition";
	import { Tooltip } from "$lib";

	const tooltip = new Tooltip({
		forceVisible: true,
		// TODO: fix portal not working
		positioning: {
			placement: "right",
		},
		closeDelay: 100_000
	});
</script>

<button {...tooltip.trigger} class="btn">Trigger</button>

{#if tooltip.open}
	<div
		{...tooltip.content}
		transition:fade={{ duration: 150 }}
		class="w-fit rounded bg-slate-300 px-2 py-1 text-sm text-slate-800"
	>
		<div {...tooltip.arrow} />
		<p>Hello world</p>
	</div>
{/if}
