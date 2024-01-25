<script lang="ts">
	import { Toggle } from "$lib";
	import { Ref } from "$lib/internal/helpers";
	import ToggleComponent from "./Toggle.svelte";

	const pressed = new Ref(false);
	const disabled = new Ref(false);

	const toggle = new Toggle({ pressed, disabled });

	$inspect(toggle.pressed, toggle.disabled);
</script>

<div class="space-y-6">
	<p>Local pressed: {pressed.value}</p>

	<div class="flex gap-24">
		<button {...toggle.root} class="btn">
			{#if toggle.pressed}
				On
			{:else}
				Off
			{/if}
		</button>

		<div class="flex items-center gap-2">
			<label for="disabled" class="select-none">Disabled</label>
			<input id="disabled" type="checkbox" bind:checked={disabled.value} />
		</div>
	</div>

	<div class="flex gap-24">
		<ToggleComponent bind:pressed={pressed.value} disabled={disabled.value} class="btn">
			{#snippet off()}
				Off
			{/snippet}
			{#snippet on()}
				On
			{/snippet}
		</ToggleComponent>

		<div class="flex items-center gap-2">
			<label for="disabled-2" class="select-none">Disabled</label>
			<input id="disabled-2" type="checkbox" bind:checked={disabled.value} />
		</div>
	</div>
</div>
