<script lang="ts">
	import { Slider } from "$lib/index.js";

	const slider = new Slider();
</script>

<h1>Slider</h1>

<div {...slider.root()} class="flex h-5 w-[200px] items-center">
	<div class="h-1 w-full rounded-full bg-neutral-400" />
	<div {...slider.range()} class="h-1 rounded-full bg-orange-400" />

	{#each slider.thumbs() as thumb}
		<div {...thumb} class="h-5 w-5 rounded-full bg-orange-400" />
	{/each}
</div>
