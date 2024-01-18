<script lang="ts">
	import { Toggle } from "$lib";

	const toggle = new Toggle({
		onPressedChange: (pressed) => {
			console.log("onPressedChange", pressed);
			return pressed;
		},
	});

	$inspect(toggle.pressed, toggle.disabled);
</script>

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
