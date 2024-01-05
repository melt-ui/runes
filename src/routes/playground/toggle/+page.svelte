<script lang="ts">
	import { Toggle } from "$lib/builders/toggle";
	import { melt } from "@melt-ui/svelte";

	const toggle = new Toggle({
		onPressedChange: (pressed) => {
			console.log("onPressedChange", pressed);
			return pressed;
		},
	});

	$inspect(toggle.pressed, toggle.disabled);
</script>

<div class="flex gap-24">
	<!--
		There is a bug in Svelte 5 where reactivity is lost
		when using the spread operator.
		`disabled={root.disabled}` is a temporary workaround.
	-->
	<button use:melt={toggle.root} disabled={toggle.disabled} class="btn">
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
