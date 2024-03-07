<script lang="ts">
	import { Dialog } from "$lib/index.js";
	import { fade } from "svelte/transition";

	const dialog = new Dialog();
</script>

<button {...dialog.trigger()} class="btn">Trigger</button>

<div {...dialog.portalled()}>
	{#if dialog.open}
		<div
			{...dialog.overlay()}
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 200 }}
		/>

		<div
			{...dialog.content()}
			class="fixed left-1/2 top-1/2 z-50 h-fit w-fit -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-neutral-50 p-4 text-neutral-900"
			transition:fade={{ duration: 200 }}
		>
			<h1 {...dialog.title()} class="mb-4 text-2xl font-medium">Title</h1>
			<p {...dialog.description()}>Here goes the description</p>
			<button {...dialog.closeButton()} class="btn mx-auto mt-6 flex">Close</button>
		</div>
	{/if}
</div>
