<script lang="ts">
	import { Toggle, createToggle } from "$lib";
	import { controlled } from "$lib/internal/helpers";

	let pressed = $state(false);

	const toggle = new Toggle({
		pressed: controlled({
			get() {
				return pressed;
			},
			set(value) {
				pressed = value;
			},
		}),
	});

	$inspect(toggle.pressed, toggle.disabled);

	const toggle2 = createToggle();
</script>

<p>Local pressed: {pressed}</p>

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
		<input id="disabled" type="checkbox" bind:checked={toggle.disabled} />
	</div>
</div>

<div class="flex gap-24">
	<button {...toggle2.root} class="btn">
		{#if toggle2.pressed}
			On
		{:else}
			Off
		{/if}
	</button>

	<div class="flex items-center gap-2">
		<label for="disabled" class="select-none">Disabled</label>
		<input id="disabled" type="checkbox" bind:checked={toggle2.disabled} />
	</div>
</div>
