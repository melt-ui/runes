<script lang="ts">
	import { Tooltip } from "$lib/index.js";
	import { fade } from "svelte/transition";

	const uncontrolled = new Tooltip({
		openDelay: 0,
		closeDelay: 1000,
		forceVisible: true,
	});

	const nested = new Tooltip({
		openDelay: 0,
		closeDelay: 1000,
		forceVisible: true,
	});

	let open = $state(false);
	const controlled = new Tooltip({
		open: {
			get: () => open,
			set: (v) => (open = v),
		},
		openDelay: 0,
		closeDelay: 1000,
		forceVisible: true,
	});

	$inspect("open", open);
	$inspect("nested.open", nested.open);
</script>

<h1>Tooltip</h1>

<section>
	<h2>Uncontrolled</h2>
	<div>
		<button {...uncontrolled.trigger()} class="btn">Trigger</button>
		{#if uncontrolled.open}
			<div {...uncontrolled.content()} class="tooltip" transition:fade={{ duration: 200 }}>
				<div {...uncontrolled.arrow()} />
				<p>Hello world</p>

				<button {...nested.trigger()} class="btn">Trigger</button>
				{#if nested.open}
					<div {...nested.content()} class="tooltip" transition:fade={{ duration: 200 }}>
						<div {...nested.arrow()} />
						<p>Hello world</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>

<hr class="my-8" />

<section>
	<h2>Controlled</h2>
	<div class="flex items-center">
		<button {...controlled.trigger()} class="btn">Trigger</button>
		{#if open}
			<div {...controlled.content()} class="tooltip" transition:fade={{ duration: 200 }}>
				<div {...controlled.arrow()} />
				<p>Hello world</p>
			</div>
		{/if}

		<label for="open" class="ml-auto select-none">Open</label>
		<input id="open" type="checkbox" bind:checked={open} class="ml-2" />
	</div>
</section>
