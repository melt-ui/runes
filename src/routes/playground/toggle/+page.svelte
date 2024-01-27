<script lang="ts">
	import { Toggle } from "$lib";
	import { State } from "$lib/internal/helpers";
	import ToggleComponent from "./Toggle.svelte";

	const uncontrolled = new Toggle();

	const pressed = new State(false);
	const disabled = new State(false);
	const controlled = new Toggle({ pressed, disabled });

	$inspect("pressed", pressed.value, "disabled", disabled.value);
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
			{#if pressed.value}
				On
			{:else}
				Off
			{/if}
		</button>

		<ToggleComponent bind:pressed={pressed.value} disabled={disabled.value} class="ml-4">
			{#snippet off()}
				Off
			{/snippet}

			{#snippet on()}
				On
			{/snippet}
		</ToggleComponent>

		<label for="disabled" class="ml-24 select-none">Disabled</label>
		<input id="disabled" type="checkbox" bind:checked={disabled.value} class="ml-2" />
	</div>
</section>
