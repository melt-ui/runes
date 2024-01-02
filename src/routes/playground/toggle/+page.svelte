<script lang="ts">
	import { createToggle } from "$lib";
	import { melt } from "@melt-ui/svelte";

	const { root, states } = createToggle({
		onPressedChange: (pressed) => {
			console.log("onPressedChange", pressed);
			return pressed;
		},
	});

	$inspect(states.pressed, states.disabled);
</script>

<div class="flex gap-24">
	<!--
		There is a bug in Svelte 5 where reactivity is lost
		when using the spread operator.
		`disabled={root.disabled}` is a temporary workaround.
	-->
	<button use:melt={root} disabled={root.disabled} class="btn">
		{#if states.pressed}
			On
		{:else}
			Off
		{/if}
	</button>

	<div class="flex items-center gap-2">
		<label for="disabled" class="select-none">Disabled</label>
		<input id="disabled" type="checkbox" bind:checked={states.disabled} />
	</div>
</div>
