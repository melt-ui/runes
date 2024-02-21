<script lang="ts">
	import { Slider, type SliderDirection, type SliderOrientation } from "$lib/index.js";

	let { value, min, max, step, orientation, dir, disabled, ticks } = $props<{
		value: number[];
		min: number;
		max: number;
		step: number;
		orientation: SliderOrientation;
		dir: SliderDirection;
		disabled: boolean;
		ticks: boolean;
	}>();

	const slider = new Slider({
		value: () => value,
		min: () => min,
		max: () => max,
		step: () => step,
		orientation: () => orientation,
		dir: () => dir,
		disabled: () => disabled,
	});
</script>

<div class="mx-auto w-fit p-4">
	<div
		{...slider.root()}
		class="
			group flex h-10 w-[12.5rem] items-center
			data-[orientation='vertical']:h-[12.5rem] data-[orientation='vertical']:w-10 data-[orientation='vertical']:flex-col
		"
	>
		<div
			class="
				h-1 w-full rounded-full bg-neutral-100
				group-data-[orientation='vertical']:h-full group-data-[orientation='vertical']:w-1
			"
		/>

		<div
			{...slider.range()}
			class="
				h-1 rounded-full bg-magnum-900
				group-data-[orientation='vertical']:h-[auto] group-data-[orientation='vertical']:w-1
			"
		/>

		{#if ticks}
			{#each slider.ticks() as tick}
				<div {...tick} class="h-1 w-1 rounded-full bg-magnum-900 data-[bounded]:bg-magnum-400" />
			{/each}
		{/if}

		{#each slider.thumbs() as thumb}
			<div
				{...thumb}
				class="
					h-5 w-5 rounded-full bg-magnum-400
					focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magnum-400
				"
			/>
		{/each}
	</div>
</div>
