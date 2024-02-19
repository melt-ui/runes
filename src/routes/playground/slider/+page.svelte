<script lang="ts">
	import { Slider } from "$lib/index.js";

	const slider = new Slider();

	const withTicks = new Slider({
		min: 0,
		max: 10,
		step: 3,
	});
</script>

<h1>Slider</h1>

<div {...slider.root()} class="flex h-5 w-[200px] items-center">
	<div class="h-1 w-full rounded-full bg-white" />
	<div {...slider.range()} class="h-1 rounded-full bg-orange-800" />

	{#each slider.thumbs() as thumb}
		<div {...thumb} class="h-5 w-5 rounded-full bg-orange-400" />
	{/each}
</div>

<section class="mt-12">
	<h2>Slider Ticks</h2>
	<div {...withTicks.root()} class="flex h-5 w-[200px] items-center">
		<div class="h-1 w-full rounded-full bg-white" />
		<div {...withTicks.range()} class="h-1 rounded-full bg-orange-800" />

		{#each withTicks.ticks() as tick}
			<div {...tick} class="h-1 w-1 rounded-full bg-orange-800 data-[bounded]:bg-orange-400" />
		{/each}

		{#each withTicks.thumbs() as thumb}
			<div {...thumb} class="h-5 w-5 rounded-full bg-orange-400" />
		{/each}
	</div>
</section>
