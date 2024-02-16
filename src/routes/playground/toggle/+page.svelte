<script lang="ts">
	import { Toggle } from "$lib/index.js";
	import ToggleComponent from "./Toggle.svelte";

	const uncontrolled = new Toggle({
		pressed: true,
	});

	let pressed = $state(false);
	let disabled = $state(false);

	const controlled = new Toggle({
		pressed: {
			get: () => pressed,
			set: (v) => (pressed = v),
		},
		disabled: () => disabled,
	});

	$inspect("pressed", pressed, "disabled", disabled);
</script>

<section>
	<h1>Uncontrolled</h1>

	<div class="mt-3">
		<button {...uncontrolled.root} class="btn">
			{#if uncontrolled.pressed}
				On
			{:else}
				Off
			{/if}
		</button>
	</div>
</section>

<hr class="my-8" />

<section>
	<h1>Controlled</h1>

	<div class="mt-3 flex items-center">
		<button {...controlled.root} class="btn">
			{#if pressed}
				On
			{:else}
				Off
			{/if}
		</button>

		<ToggleComponent bind:pressed {disabled} class="ml-4">
			{#snippet off()}
				Off
			{/snippet}

			{#snippet on()}
				On
			{/snippet}
		</ToggleComponent>

		<label for="disabled" class="ml-24 select-none">Disabled</label>
		<input id="disabled" type="checkbox" bind:checked={disabled} class="ml-2" />
	</div>
</section>
