<script lang="ts">
	import { Slider } from "@melt-ui/slider";
	import Toggle from "./toggle.svelte";

	const slider = new Slider();

	const withTicks = new Slider({
		min: 0,
		max: 10,
		step: 3,
	});

</script>

<main class="p-8">
	<h1 class="text-4xl font-bold mb-4">Docs</h1>

	<h2 class="mt-8">Toggle</h2>
	<section aria-label="Example">
		<Toggle pressed={true} />

	</section>

	<h2 class="mt-8">Slider</h2>
	<section aria-label="Example">
		<div {...slider.root()} class="flex h-10 w-[12.5rem] items-center">
			<div class="h-1 w-full rounded-full bg-neutral-300" />
			<div {...slider.range()} class="h-1 rounded-full bg-orange-700" />
			{#each slider.thumbs() as thumb}
				<div
					{...thumb}
					class="h-5 w-5 rounded-full bg-orange-300 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-orange-700"
				/>
			{/each}
		</div>
	</section>
	<section aria-labelledby="ticks-header" class="pt-12">
		<h2 id="ticks-header">Ticks</h2>
		<div {...withTicks.root()} class="flex h-10 w-[12.5rem] items-center">
			<div class="h-1 w-full rounded-full bg-neutral-300" />
			<div {...withTicks.range()} class="h-1 rounded-full bg-orange-700" />
			{#each withTicks.ticks() as tick}
				<div {...tick} class="h-1 w-1 rounded-full bg-orange-700 data-[bounded]:bg-orange-300" />
			{/each}
			{#each withTicks.thumbs() as thumb}
				<div
					{...thumb}
					class="h-5 w-5 rounded-full bg-orange-300 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-orange-700"
				/>
			{/each}
		</div>
	</section>

</main>
