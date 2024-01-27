<script lang="ts">
	import { Toggle } from "$lib";
	import { ref } from "$lib/internal/helpers";
	import ToggleComponent from "./Toggle.svelte";

	const pressed = ref(false);
	const disabled = ref(false);
	const controlled = new Toggle({ pressed, disabled });

	$inspect(controlled.pressed, controlled.disabled);

	const uncontrolled = new Toggle();
</script>

<div class="space-y-8">
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

			<ToggleComponent bind:pressed={pressed.value} disabled={disabled.value} class="btn ml-4">
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

	<section>
		<h1>Uncontrolled</h1>

		<button {...uncontrolled.root} class="btn mt-3 flex">
			{#if uncontrolled.pressed}
				On
			{:else}
				Off
			{/if}
		</button>
	</section>
</div>
