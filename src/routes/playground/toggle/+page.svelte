<script lang="ts">
	import { Toggle } from "$lib/index.js";

	const uncontrolled = new Toggle();

	let pressed = $state(false);
	let disabled = $state(false);

	const controlled = new Toggle({
		pressed: {
			get: () => pressed,
			set: (v) => (pressed = v),
		},
		disabled: () => disabled,
	});

	$inspect("pressed", pressed);
	$inspect("disabled", disabled);
</script>

<h1>Toggle</h1>

<section>
	<h2>Uncontrolled</h2>
	<div>
		<button {...uncontrolled.root()} class="btn">
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
	<h2>Controlled</h2>
	<div class="flex items-center">
		<button {...controlled.root()} class="btn">
			{#if pressed}
				On
			{:else}
				Off
			{/if}
		</button>

		<label for="disabled" class="ml-auto select-none">Disabled</label>
		<input id="disabled" type="checkbox" bind:checked={disabled} class="ml-2" />
	</div>
</section>
